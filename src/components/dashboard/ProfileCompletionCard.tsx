import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Building2, ClipboardList, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export function ProfileCompletionCard() {
  const { user, hasRole } = useAuth();
  const [trainerPct, setTrainerPct] = useState<number | null>(null);
  const [gymPct, setGymPct] = useState<number | null>(null);

  const isTrainer = hasRole("trainer");
  const isGym = hasRole("gym_admin");

  useEffect(() => {
    if (!user) return;
    if (!isTrainer && !isGym) return;
    (async () => {
      if (isTrainer) {
        const { data } = await supabase.rpc("get_trainer_profile_completion", { _user_id: user.id });
        if (typeof data === "number") setTrainerPct(data);
      }
      if (isGym) {
        const { data } = await supabase.rpc("get_gym_profile_completion", { _user_id: user.id });
        if (typeof data === "number") setGymPct(data);
      }
    })();
  }, [user, isTrainer, isGym]);

  const trainerIncomplete = isTrainer && trainerPct !== null && trainerPct < 100;
  const gymIncomplete = isGym && gymPct !== null && gymPct < 100;

  if (!trainerIncomplete && !gymIncomplete) return null;

  return (
    <Card className="border-orange-500/30 bg-orange-500/5 p-5 mb-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
          <AlertCircle className="w-5 h-5 text-orange-500" />
        </div>
        <div>
          <h3 className="font-semibold mb-1">Complete your profile to unlock features</h3>
          <p className="text-sm text-muted-foreground">
            Your trainer/gym dashboard is locked until your profile is complete.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {trainerIncomplete && (
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">Trainer Profile</span>
              </div>
              <span className="text-sm font-semibold">{trainerPct}%</span>
            </div>
            <Progress value={trainerPct ?? 0} className="h-1.5 mb-3" />
            <Button size="sm" asChild className="w-full sm:w-auto">
              <Link to="/onboarding/trainer">Complete Trainer Profile</Link>
            </Button>
          </div>
        )}
        {gymIncomplete && (
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">Gym Profile</span>
              </div>
              <span className="text-sm font-semibold">{gymPct}%</span>
            </div>
            <Progress value={gymPct ?? 0} className="h-1.5 mb-3" />
            <Button size="sm" asChild className="w-full sm:w-auto">
              <Link to="/onboarding/gym">Complete Gym Profile</Link>
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
