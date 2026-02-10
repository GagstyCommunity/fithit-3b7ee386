
-- Allow trainers to view their clients' profiles (needed for trainer client management)
CREATE POLICY "Trainers can view client profiles"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM trainer_clients
    WHERE trainer_clients.trainer_id = auth.uid()
    AND trainer_clients.client_id = profiles.user_id
    AND trainer_clients.status = 'active'
  )
);

-- Allow trainers to view their clients' fitness records (needed for program design)
CREATE POLICY "Trainers can view client fitness records"
ON public.fitness_records
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM trainer_clients
    WHERE trainer_clients.trainer_id = auth.uid()
    AND trainer_clients.client_id = fitness_records.user_id
    AND trainer_clients.status = 'active'
  )
);

-- Allow trainers to view client weight history
CREATE POLICY "Trainers can view client weight history"
ON public.weight_history
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM trainer_clients
    WHERE trainer_clients.trainer_id = auth.uid()
    AND trainer_clients.client_id = weight_history.user_id
    AND trainer_clients.status = 'active'
  )
);
