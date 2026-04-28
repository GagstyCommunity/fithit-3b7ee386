
-- 1. Add fitness_id to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS fitness_id text UNIQUE;

-- Generator: FH- + 6 uppercase alphanumeric chars
CREATE OR REPLACE FUNCTION public.generate_fitness_id()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  candidate text;
  i int;
  exists_already boolean;
BEGIN
  LOOP
    candidate := 'FH-';
    FOR i IN 1..6 LOOP
      candidate := candidate || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE fitness_id = candidate) INTO exists_already;
    EXIT WHEN NOT exists_already;
  END LOOP;
  RETURN candidate;
END;
$$;

-- Backfill existing profiles
UPDATE public.profiles
SET fitness_id = public.generate_fitness_id()
WHERE fitness_id IS NULL;

-- Update handle_new_user to assign fitness_id
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, fitness_id)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name',''), public.generate_fitness_id());

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  INSERT INTO public.fitness_records (user_id) VALUES (NEW.id);
  INSERT INTO public.wallets (user_id) VALUES (NEW.id);

  RETURN NEW;
END;
$$;

-- 2. Streak function: consecutive days ending today (or yesterday) with a completed workout
CREATE OR REPLACE FUNCTION public.get_user_streak(_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  streak_count int := 0;
  check_date date := CURRENT_DATE;
  has_workout boolean;
BEGIN
  -- If no workout today, start counting from yesterday so streak doesn't break mid-day
  SELECT EXISTS(
    SELECT 1 FROM public.workout_logs
    WHERE user_id = _user_id AND status = 'completed' AND scheduled_date = check_date
  ) INTO has_workout;

  IF NOT has_workout THEN
    check_date := check_date - 1;
  END IF;

  LOOP
    SELECT EXISTS(
      SELECT 1 FROM public.workout_logs
      WHERE user_id = _user_id AND status = 'completed' AND scheduled_date = check_date
    ) INTO has_workout;
    EXIT WHEN NOT has_workout;
    streak_count := streak_count + 1;
    check_date := check_date - 1;
  END LOOP;

  RETURN streak_count;
END;
$$;

-- 3. Fitness score: simple weighted formula capped at 1000
CREATE OR REPLACE FUNCTION public.get_fitness_score(_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  completed_count int;
  streak_val int;
  active_goals int;
  raw_score int;
BEGIN
  SELECT COUNT(*) INTO completed_count
  FROM public.workout_logs
  WHERE user_id = _user_id AND status = 'completed';

  streak_val := public.get_user_streak(_user_id);

  SELECT COUNT(*) INTO active_goals
  FROM public.fitness_goals
  WHERE user_id = _user_id AND status = 'active';

  raw_score := (completed_count * 10) + (streak_val * 5) + (active_goals * 20) + 100;
  RETURN LEAST(raw_score, 1000);
END;
$$;

-- 4. Profile completion percentage helpers
CREATE OR REPLACE FUNCTION public.get_trainer_profile_completion(_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  rec record;
  filled int := 0;
  total int := 5;
BEGIN
  SELECT * INTO rec FROM public.trainer_profiles WHERE user_id = _user_id;
  IF NOT FOUND THEN RETURN 0; END IF;
  IF rec.bio IS NOT NULL AND length(rec.bio) > 10 THEN filled := filled + 1; END IF;
  IF rec.years_experience IS NOT NULL THEN filled := filled + 1; END IF;
  IF rec.specialties IS NOT NULL AND array_length(rec.specialties, 1) > 0 THEN filled := filled + 1; END IF;
  IF rec.certifications IS NOT NULL AND array_length(rec.certifications, 1) > 0 THEN filled := filled + 1; END IF;
  IF rec.hourly_rate IS NOT NULL THEN filled := filled + 1; END IF;
  RETURN (filled * 100) / total;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_gym_profile_completion(_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  rec record;
  filled int := 0;
  total int := 5;
BEGIN
  SELECT * INTO rec FROM public.gym_profiles WHERE user_id = _user_id;
  IF NOT FOUND THEN RETURN 0; END IF;
  IF rec.gym_name IS NOT NULL AND length(rec.gym_name) > 1 THEN filled := filled + 1; END IF;
  IF rec.business_address IS NOT NULL THEN filled := filled + 1; END IF;
  IF rec.city IS NOT NULL THEN filled := filled + 1; END IF;
  IF rec.contact_phone IS NOT NULL THEN filled := filled + 1; END IF;
  IF rec.amenities IS NOT NULL AND array_length(rec.amenities, 1) > 0 THEN filled := filled + 1; END IF;
  RETURN (filled * 100) / total;
END;
$$;
