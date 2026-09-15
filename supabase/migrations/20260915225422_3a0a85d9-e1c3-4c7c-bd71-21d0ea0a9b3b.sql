-- Profile additions
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS username text UNIQUE,
  ADD COLUMN IF NOT EXISTS gender text,
  ADD COLUMN IF NOT EXISTS location text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS onboarding_completed boolean NOT NULL DEFAULT false;

ALTER TABLE public.fitness_records
  ADD COLUMN IF NOT EXISTS target_weight_kg numeric,
  ADD COLUMN IF NOT EXISTS waist_cm numeric,
  ADD COLUMN IF NOT EXISTS chest_cm numeric,
  ADD COLUMN IF NOT EXISTS arms_cm numeric,
  ADD COLUMN IF NOT EXISTS thighs_cm numeric,
  ADD COLUMN IF NOT EXISTS hips_cm numeric,
  ADD COLUMN IF NOT EXISTS primary_goal text,
  ADD COLUMN IF NOT EXISTS training_experience text,
  ADD COLUMN IF NOT EXISTS workout_frequency integer,
  ADD COLUMN IF NOT EXISTS preferred_duration integer,
  ADD COLUMN IF NOT EXISTS preferred_days text[],
  ADD COLUMN IF NOT EXISTS training_location text,
  ADD COLUMN IF NOT EXISTS available_equipment text[];

-- Self-directed workouts
CREATE TABLE IF NOT EXISTS public.user_workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  notes text,
  focus text,
  estimated_duration integer,
  is_template boolean NOT NULL DEFAULT true,
  archived boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_workouts TO authenticated;
GRANT ALL ON public.user_workouts TO service_role;
ALTER TABLE public.user_workouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own user_workouts" ON public.user_workouts FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "trainers view client workouts" ON public.user_workouts FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.trainer_clients tc WHERE tc.trainer_id = auth.uid() AND tc.client_id = user_workouts.user_id AND tc.status = 'active'));
CREATE INDEX IF NOT EXISTS idx_user_workouts_user ON public.user_workouts(user_id);
CREATE TRIGGER user_workouts_updated_at BEFORE UPDATE ON public.user_workouts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.user_workout_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id uuid NOT NULL REFERENCES public.user_workouts(id) ON DELETE CASCADE,
  exercise_id uuid NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  order_index integer NOT NULL DEFAULT 0,
  sets integer NOT NULL DEFAULT 3,
  reps text NOT NULL DEFAULT '10',
  weight_kg numeric,
  duration_seconds integer,
  rest_seconds integer NOT NULL DEFAULT 60,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_workout_exercises TO authenticated;
GRANT ALL ON public.user_workout_exercises TO service_role;
ALTER TABLE public.user_workout_exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own user_workout_exercises" ON public.user_workout_exercises FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_workouts w WHERE w.id = workout_id AND w.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_workouts w WHERE w.id = workout_id AND w.user_id = auth.uid()));
CREATE INDEX IF NOT EXISTS idx_uwe_workout ON public.user_workout_exercises(workout_id);

-- Workout engine
CREATE TABLE IF NOT EXISTS public.workout_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_workout_id uuid REFERENCES public.user_workouts(id) ON DELETE SET NULL,
  daily_workout_id uuid REFERENCES public.daily_workouts(id) ON DELETE SET NULL,
  name text NOT NULL DEFAULT 'Workout',
  state text NOT NULL DEFAULT 'in_progress',
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  paused_at timestamptz,
  accumulated_seconds integer NOT NULL DEFAULT 0,
  current_exercise_index integer NOT NULL DEFAULT 0,
  current_set_index integer NOT NULL DEFAULT 0,
  total_volume numeric NOT NULL DEFAULT 0,
  total_sets integer NOT NULL DEFAULT 0,
  total_reps integer NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workout_sessions TO authenticated;
GRANT ALL ON public.workout_sessions TO service_role;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own workout_sessions" ON public.workout_sessions FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "trainers view client sessions" ON public.workout_sessions FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.trainer_clients tc WHERE tc.trainer_id = auth.uid() AND tc.client_id = workout_sessions.user_id AND tc.status = 'active'));
CREATE INDEX IF NOT EXISTS idx_sessions_user_state ON public.workout_sessions(user_id, state);
CREATE INDEX IF NOT EXISTS idx_sessions_user_started ON public.workout_sessions(user_id, started_at DESC);
CREATE TRIGGER workout_sessions_updated_at BEFORE UPDATE ON public.workout_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.session_sets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.workout_sessions(id) ON DELETE CASCADE,
  exercise_id uuid REFERENCES public.exercises(id) ON DELETE SET NULL,
  exercise_name text NOT NULL,
  exercise_index integer NOT NULL DEFAULT 0,
  set_number integer NOT NULL,
  target_reps text,
  actual_reps integer,
  target_weight numeric,
  actual_weight numeric,
  completed boolean NOT NULL DEFAULT false,
  rest_seconds integer,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.session_sets TO authenticated;
GRANT ALL ON public.session_sets TO service_role;
ALTER TABLE public.session_sets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own session_sets" ON public.session_sets FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.workout_sessions s WHERE s.id = session_id AND s.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.workout_sessions s WHERE s.id = session_id AND s.user_id = auth.uid()));
CREATE INDEX IF NOT EXISTS idx_session_sets_session ON public.session_sets(session_id);

-- Hydration
CREATE TABLE IF NOT EXISTS public.water_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_ml integer NOT NULL,
  logged_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.water_logs TO authenticated;
GRANT ALL ON public.water_logs TO service_role;
ALTER TABLE public.water_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own water_logs" ON public.water_logs FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_water_logs_user_date ON public.water_logs(user_id, logged_date);