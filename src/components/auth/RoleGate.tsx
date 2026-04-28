import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface RoleGateProps {
  children: ReactNode;
  requires: "trainer_profile" | "gym_profile";
}

/**
 * Hard-blocks access until the trainer or gym profile is 100% complete.
 * Redirects to the appropriate onboarding screen otherwise.
 */
export function RoleGate({ children, requires }: RoleGateProps) {
  const { user, isLoading } = useAuth();
  const [pct, setPct] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    const fn = requires === "trainer_profile"
      ? "get_trainer_profile_completion"
      : "get_gym_profile_completion";
    supabase.rpc(fn, { _user_id: user.id }).then(({ data }) => {
      setPct(typeof data === "number" ? data : 0);
    });
  }, [user, requires]);

  if (isLoading || pct === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (pct < 100) {
    return <Navigate to={requires === "trainer_profile" ? "/onboarding/trainer" : "/onboarding/gym"} replace />;
  }

  return <>{children}</>;
}
