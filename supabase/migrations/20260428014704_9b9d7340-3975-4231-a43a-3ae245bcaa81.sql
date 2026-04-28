
ALTER FUNCTION public.generate_fitness_id() SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.generate_fitness_id() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_user_streak(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_fitness_score(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_trainer_profile_completion(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_gym_profile_completion(uuid) FROM anon, public;

GRANT EXECUTE ON FUNCTION public.get_user_streak(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_fitness_score(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_trainer_profile_completion(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_gym_profile_completion(uuid) TO authenticated;
