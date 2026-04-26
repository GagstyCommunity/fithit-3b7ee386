-- Trainer profiles
CREATE TABLE public.trainer_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  bio TEXT,
  years_experience INTEGER,
  specialties TEXT[],
  certifications TEXT[],
  hourly_rate NUMERIC,
  accepting_clients BOOLEAN NOT NULL DEFAULT true,
  profile_complete BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.trainer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers manage own profile"
ON public.trainer_profiles FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Anyone can view trainer profiles"
ON public.trainer_profiles FOR SELECT
USING (profile_complete = true);

CREATE TRIGGER trainer_profiles_updated_at
BEFORE UPDATE ON public.trainer_profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Gym profiles
CREATE TABLE public.gym_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  gym_name TEXT NOT NULL DEFAULT '',
  business_address TEXT,
  city TEXT,
  contact_phone TEXT,
  website TEXT,
  amenities TEXT[],
  opening_hours JSONB,
  verified BOOLEAN NOT NULL DEFAULT false,
  profile_complete BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.gym_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gym admins manage own gym"
ON public.gym_profiles FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Anyone can view completed gym profiles"
ON public.gym_profiles FOR SELECT
USING (profile_complete = true);

CREATE TRIGGER gym_profiles_updated_at
BEFORE UPDATE ON public.gym_profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RPC: allow a signed-in user to add a trainer/gym_admin role to themselves
CREATE OR REPLACE FUNCTION public.self_assign_role(_role app_role)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF _role NOT IN ('trainer', 'gym_admin') THEN
    RAISE EXCEPTION 'Cannot self-assign role %', _role;
  END IF;
  INSERT INTO public.user_roles (user_id, role, granted_by)
  VALUES (auth.uid(), _role, auth.uid())
  ON CONFLICT DO NOTHING;
END;
$$;