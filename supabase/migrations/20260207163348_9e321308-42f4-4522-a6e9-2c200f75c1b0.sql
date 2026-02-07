-- Exercise library (global + trainer custom)
CREATE TABLE public.exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  body_part TEXT NOT NULL,
  category TEXT NOT NULL, -- strength, cardio, flexibility, etc.
  equipment TEXT[], -- barbell, dumbbell, machine, bodyweight, etc.
  instructions TEXT[],
  is_global BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Workout programs (4-8 week plans)
CREATE TABLE public.workout_programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trainer_id UUID NOT NULL REFERENCES auth.users(id),
  client_id UUID NOT NULL REFERENCES auth.users(id),
  name TEXT NOT NULL,
  description TEXT,
  duration_weeks INTEGER NOT NULL DEFAULT 4,
  status TEXT NOT NULL DEFAULT 'active', -- active, completed, paused
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Weekly splits within a program
CREATE TABLE public.weekly_splits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id UUID NOT NULL REFERENCES public.workout_programs(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  name TEXT, -- e.g. "Week 1 - Foundation"
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Daily workouts within a weekly split
CREATE TABLE public.daily_workouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  split_id UUID NOT NULL REFERENCES public.weekly_splits(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL, -- 0=Sunday, 1=Monday, etc.
  name TEXT NOT NULL, -- e.g. "Upper Body Strength"
  estimated_duration INTEGER, -- minutes
  safety_notes TEXT,
  trainer_notes_private TEXT,
  trainer_notes_shared TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Exercises assigned to a daily workout
CREATE TABLE public.workout_exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_id UUID NOT NULL REFERENCES public.daily_workouts(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id),
  order_index INTEGER NOT NULL DEFAULT 0,
  sets INTEGER NOT NULL DEFAULT 3,
  reps TEXT NOT NULL DEFAULT '10', -- can be "10" or "8-12" or "AMRAP"
  weight_per_side DECIMAL(10,2), -- kg
  total_weight DECIMAL(10,2), -- auto-calculated or set
  rest_seconds INTEGER DEFAULT 60,
  trainer_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User workout logs (execution tracking)
CREATE TABLE public.workout_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  workout_id UUID REFERENCES public.daily_workouts(id),
  scheduled_date DATE NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, in_progress, completed, missed
  completion_percentage INTEGER DEFAULT 0,
  total_volume DECIMAL(12,2), -- kg lifted
  duration_minutes INTEGER,
  user_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Individual exercise logs within a workout session
CREATE TABLE public.exercise_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_log_id UUID NOT NULL REFERENCES public.workout_logs(id) ON DELETE CASCADE,
  workout_exercise_id UUID NOT NULL REFERENCES public.workout_exercises(id),
  status TEXT NOT NULL DEFAULT 'pending', -- pending, completed, skipped
  sets_completed INTEGER DEFAULT 0,
  actual_reps TEXT,
  actual_weight DECIMAL(10,2),
  user_note TEXT, -- pain, too heavy, etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Fitness timeline events
CREATE TABLE public.timeline_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  event_type TEXT NOT NULL, -- gym_joined, gym_left, trainer_assigned, trainer_removed, injury, achievement, program_started, program_completed
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB, -- store additional data like gym_id, trainer_id, etc.
  event_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Trainer-client relationships
CREATE TABLE public.trainer_clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trainer_id UUID NOT NULL REFERENCES auth.users(id),
  client_id UUID NOT NULL REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'active', -- active, paused, ended
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  access_level TEXT NOT NULL DEFAULT 'view', -- view, comment, edit
  UNIQUE(trainer_id, client_id)
);

-- User fitness goals
CREATE TABLE public.fitness_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  goal_type TEXT NOT NULL, -- fat_loss, muscle_gain, strength, endurance, rehab, general
  title TEXT NOT NULL,
  description TEXT,
  target_value DECIMAL(10,2),
  target_unit TEXT, -- kg, %, reps, minutes
  current_value DECIMAL(10,2),
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  target_date DATE,
  status TEXT NOT NULL DEFAULT 'active', -- active, completed, abandoned
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User achievements
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  achievement_type TEXT NOT NULL, -- streak, weight_milestone, strength_pr, program_completed
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainer_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fitness_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for exercises (global readable, trainers can create custom)
CREATE POLICY "Anyone can view global exercises" ON public.exercises FOR SELECT USING (is_global = true);
CREATE POLICY "Trainers can view their custom exercises" ON public.exercises FOR SELECT USING (created_by = auth.uid());
CREATE POLICY "Trainers can create custom exercises" ON public.exercises FOR INSERT WITH CHECK (auth.uid() = created_by AND is_global = false);
CREATE POLICY "Trainers can update their custom exercises" ON public.exercises FOR UPDATE USING (created_by = auth.uid() AND is_global = false);
CREATE POLICY "Trainers can delete their custom exercises" ON public.exercises FOR DELETE USING (created_by = auth.uid() AND is_global = false);

-- RLS Policies for workout programs
CREATE POLICY "Trainers can view programs they created" ON public.workout_programs FOR SELECT USING (trainer_id = auth.uid());
CREATE POLICY "Clients can view their programs" ON public.workout_programs FOR SELECT USING (client_id = auth.uid());
CREATE POLICY "Trainers can create programs" ON public.workout_programs FOR INSERT WITH CHECK (trainer_id = auth.uid());
CREATE POLICY "Trainers can update their programs" ON public.workout_programs FOR UPDATE USING (trainer_id = auth.uid());
CREATE POLICY "Trainers can delete their programs" ON public.workout_programs FOR DELETE USING (trainer_id = auth.uid());

-- RLS Policies for weekly splits
CREATE POLICY "Users can view splits for their programs" ON public.weekly_splits FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.workout_programs WHERE id = program_id AND (trainer_id = auth.uid() OR client_id = auth.uid())));
CREATE POLICY "Trainers can manage splits" ON public.weekly_splits FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.workout_programs WHERE id = program_id AND trainer_id = auth.uid()));

-- RLS Policies for daily workouts
CREATE POLICY "Users can view daily workouts" ON public.daily_workouts FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.weekly_splits ws JOIN public.workout_programs wp ON ws.program_id = wp.id WHERE ws.id = split_id AND (wp.trainer_id = auth.uid() OR wp.client_id = auth.uid())));
CREATE POLICY "Trainers can manage daily workouts" ON public.daily_workouts FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.weekly_splits ws JOIN public.workout_programs wp ON ws.program_id = wp.id WHERE ws.id = split_id AND wp.trainer_id = auth.uid()));

-- RLS Policies for workout exercises
CREATE POLICY "Users can view workout exercises" ON public.workout_exercises FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.daily_workouts dw JOIN public.weekly_splits ws ON dw.split_id = ws.id JOIN public.workout_programs wp ON ws.program_id = wp.id WHERE dw.id = workout_id AND (wp.trainer_id = auth.uid() OR wp.client_id = auth.uid())));
CREATE POLICY "Trainers can manage workout exercises" ON public.workout_exercises FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.daily_workouts dw JOIN public.weekly_splits ws ON dw.split_id = ws.id JOIN public.workout_programs wp ON ws.program_id = wp.id WHERE dw.id = workout_id AND wp.trainer_id = auth.uid()));

-- RLS Policies for workout logs
CREATE POLICY "Users can view own workout logs" ON public.workout_logs FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create own workout logs" ON public.workout_logs FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own workout logs" ON public.workout_logs FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Trainers can view client workout logs" ON public.workout_logs FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.trainer_clients WHERE trainer_id = auth.uid() AND client_id = user_id AND status = 'active'));

-- RLS Policies for exercise logs
CREATE POLICY "Users can manage own exercise logs" ON public.exercise_logs FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.workout_logs WHERE id = workout_log_id AND user_id = auth.uid()));
CREATE POLICY "Trainers can view client exercise logs" ON public.exercise_logs FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.workout_logs wl JOIN public.trainer_clients tc ON wl.user_id = tc.client_id WHERE wl.id = workout_log_id AND tc.trainer_id = auth.uid() AND tc.status = 'active'));

-- RLS Policies for timeline events
CREATE POLICY "Users can view own timeline" ON public.timeline_events FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create own timeline events" ON public.timeline_events FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Trainers can view client timeline" ON public.timeline_events FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.trainer_clients WHERE trainer_id = auth.uid() AND client_id = user_id AND status = 'active'));

-- RLS Policies for trainer-client relationships
CREATE POLICY "Trainers can view their clients" ON public.trainer_clients FOR SELECT USING (trainer_id = auth.uid());
CREATE POLICY "Clients can view their trainers" ON public.trainer_clients FOR SELECT USING (client_id = auth.uid());
CREATE POLICY "Trainers can manage their clients" ON public.trainer_clients FOR ALL USING (trainer_id = auth.uid());

-- RLS Policies for fitness goals
CREATE POLICY "Users can manage own goals" ON public.fitness_goals FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Trainers can view client goals" ON public.fitness_goals FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.trainer_clients WHERE trainer_id = auth.uid() AND client_id = user_id AND status = 'active'));

-- RLS Policies for achievements
CREATE POLICY "Users can view own achievements" ON public.achievements FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Trainers can view client achievements" ON public.achievements FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.trainer_clients WHERE trainer_id = auth.uid() AND client_id = user_id AND status = 'active'));

-- Create triggers for updated_at
CREATE TRIGGER update_exercises_updated_at BEFORE UPDATE ON public.exercises FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_workout_programs_updated_at BEFORE UPDATE ON public.workout_programs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_daily_workouts_updated_at BEFORE UPDATE ON public.daily_workouts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_workout_logs_updated_at BEFORE UPDATE ON public.workout_logs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_fitness_goals_updated_at BEFORE UPDATE ON public.fitness_goals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();