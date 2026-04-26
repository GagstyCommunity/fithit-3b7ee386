import { AuthLayout } from "@/components/auth/AuthLayout";
import { RoleSignupForm } from "@/components/auth/RoleSignupForm";

export default function GymSignup() {
  return (
    <AuthLayout
      title="List Your Gym"
      subtitle="2 months free. Manage members, trainers, and earn referral revenue."
    >
      <RoleSignupForm role="gym_admin" completionPath="/onboarding/gym" />
    </AuthLayout>
  );
}
