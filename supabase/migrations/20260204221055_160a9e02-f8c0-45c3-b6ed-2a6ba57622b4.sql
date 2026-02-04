-- =====================================================
-- FITNESS OPERATING SYSTEM - CORE SCHEMA
-- Phase 1: Foundation & Authentication
-- =====================================================

-- 1. Create app_role enum for role-based access control
CREATE TYPE public.app_role AS ENUM ('user', 'trainer', 'gym_admin', 'super_admin');

-- 2. Create access_level enum for permission system
CREATE TYPE public.access_level AS ENUM ('view', 'comment', 'edit');

-- 3. Create fitness_level enum
CREATE TYPE public.fitness_level AS ENUM ('beginner', 'intermediate', 'advanced', 'athlete');

-- =====================================================
-- PROFILES TABLE
-- Core user profile data (not roles - stored separately)
-- =====================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  date_of_birth DATE,
  timezone TEXT DEFAULT 'UTC',
  preferred_workout_time TEXT DEFAULT 'morning', -- morning, evening, custom
  notification_preferences JSONB DEFAULT '{"workout_reminder": true, "reminder_minutes": 60}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- USER ROLES TABLE
-- Separate table for security (prevents privilege escalation)
-- =====================================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL DEFAULT 'user',
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  granted_by UUID REFERENCES auth.users(id),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- SECURITY DEFINER FUNCTION FOR ROLE CHECKING
-- Prevents infinite recursion in RLS policies
-- =====================================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to get all roles for a user
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id UUID)
RETURNS SETOF public.app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id
$$;

-- User roles RLS policies
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Super admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'super_admin'));

-- =====================================================
-- FITNESS RECORDS TABLE
-- The permanent user-owned fitness record
-- =====================================================
CREATE TABLE public.fitness_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  
  -- Body & Health
  height_cm DECIMAL(5,2),
  current_weight_kg DECIMAL(5,2),
  body_fat_percentage DECIMAL(4,1),
  fitness_level public.fitness_level DEFAULT 'beginner',
  
  -- Medical & Safety (Private by default)
  current_injuries TEXT[],
  past_injuries TEXT[],
  pain_areas TEXT[],
  food_allergies TEXT[],
  supplement_allergies TEXT[],
  doctor_restrictions TEXT,
  medical_notes_private BOOLEAN DEFAULT true,
  
  -- Preferences
  preferred_units TEXT DEFAULT 'metric', -- metric or imperial
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on fitness_records
ALTER TABLE public.fitness_records ENABLE ROW LEVEL SECURITY;

-- Fitness records RLS policies (user-owned)
CREATE POLICY "Users can view own fitness record"
  ON public.fitness_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own fitness record"
  ON public.fitness_records FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fitness record"
  ON public.fitness_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- WEIGHT HISTORY TABLE
-- Track weight over time
-- =====================================================
CREATE TABLE public.weight_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  weight_kg DECIMAL(5,2) NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.weight_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own weight history"
  ON public.weight_history FOR ALL
  USING (auth.uid() = user_id);

-- =====================================================
-- ACCESS AUDIT LOG TABLE
-- Track who accessed user data
-- =====================================================
CREATE TABLE public.access_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL, -- whose data was accessed
  accessed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL, -- who accessed it
  resource_type TEXT NOT NULL, -- 'fitness_record', 'workout', etc.
  resource_id UUID,
  access_type TEXT NOT NULL, -- 'view', 'edit', 'comment'
  accessed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  duration_seconds INTEGER,
  ip_address INET
);

-- Enable RLS
ALTER TABLE public.access_audit_log ENABLE ROW LEVEL SECURITY;

-- Users can view their own access logs
CREATE POLICY "Users can view own access logs"
  ON public.access_audit_log FOR SELECT
  USING (auth.uid() = user_id);

-- =====================================================
-- UPDATED_AT TRIGGER FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fitness_records_updated_at
  BEFORE UPDATE ON public.fitness_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- AUTO-CREATE PROFILE AND FITNESS RECORD ON SIGNUP
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  -- Create empty fitness record
  INSERT INTO public.fitness_records (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to auto-create on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_fitness_records_user_id ON public.fitness_records(user_id);
CREATE INDEX idx_weight_history_user_id ON public.weight_history(user_id);
CREATE INDEX idx_weight_history_recorded_at ON public.weight_history(user_id, recorded_at DESC);
CREATE INDEX idx_access_audit_log_user_id ON public.access_audit_log(user_id);
CREATE INDEX idx_access_audit_log_accessed_at ON public.access_audit_log(accessed_at DESC);