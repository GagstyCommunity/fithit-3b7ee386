import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Building2, Dumbbell, Loader2, Check } from "lucide-react";

export default function UpgradeRole() {
  const { roles } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const upgrade = async (role: "trainer" | "gym_admin", redirect: string) => {
    setLoading(role);
    const { error } = await supabase.rpc("self_assign_role", { _role: role });
    setLoading(null);
    if (error) {
      toast({ variant: "destructive", title: "Upgrade failed", description: error.message });
      return;
    }
    toast({ title: "Role added", description: "Complete your profile to continue." });
    // Force a reload so useAuth picks up the new role
    window.location.assign(redirect);
  };

  const hasTrainer = roles.includes("trainer");
  const hasGym = roles.includes("gym_admin");

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Upgrade your account</h1>
          <p className="text-muted-foreground mt-1">
            Add a Trainer or Gym role to your existing account. Your fitness data stays yours.
          </p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Dumbbell className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Become a Trainer</CardTitle>
                <CardDescription>Free forever. Manage clients & build programs.</CardDescription>
              </div>
            </div>
            {hasTrainer && <Badge variant="secondary"><Check className="h-3 w-3 mr-1" />Active</Badge>}
          </CardHeader>
          <CardContent>
            {hasTrainer ? (
              <Button variant="outline" onClick={() => navigate("/trainer")}>
                Go to Trainer dashboard
              </Button>
            ) : (
              <Button
                onClick={() => upgrade("trainer", "/onboarding/trainer")}
                disabled={loading === "trainer"}
              >
                {loading === "trainer" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Trainer role
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>List your Gym</CardTitle>
                <CardDescription>2 months free, then ₹1299/mo. Earn ₹10 per active member.</CardDescription>
              </div>
            </div>
            {hasGym && <Badge variant="secondary"><Check className="h-3 w-3 mr-1" />Active</Badge>}
          </CardHeader>
          <CardContent>
            {hasGym ? (
              <Button variant="outline" onClick={() => navigate("/gym")}>
                Go to Gym dashboard
              </Button>
            ) : (
              <Button
                onClick={() => upgrade("gym_admin", "/onboarding/gym")}
                disabled={loading === "gym_admin"}
              >
                {loading === "gym_admin" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Gym role
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
