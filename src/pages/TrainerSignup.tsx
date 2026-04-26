import { AuthLayout } from "@/components/auth/AuthLayout";
import { RoleSignupForm } from "@/components/auth/RoleSignupForm";

export default function TrainerSignup() {
  return (
    <AuthLayout
      title="Join as a Trainer"
      subtitle="Free forever. Manage clients, build programs, grow your reputation."
    >
      <RoleSignupForm role="trainer" completionPath="/onboarding/trainer" />
    </AuthLayout>
  );
}
