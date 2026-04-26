import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TodayWorkout } from "@/components/workout/TodayWorkout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { CheckCircle2, Clock, Dumbbell } from "lucide-react";

interface LogRow {
  id: string;
  scheduled_date: string;
  status: string;
  duration_minutes: number | null;
  completion_percentage: number | null;
  total_volume: number | null;
}

export default function Workouts() {
  const { user } = useAuth();
  const [history, setHistory] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("workout_logs")
        .select("id, scheduled_date, status, duration_minutes, completion_percentage, total_volume")
        .eq("user_id", user.id)
        .order("scheduled_date", { ascending: false })
        .limit(30);
      setHistory(data || []);
      setLoading(false);
    })();
  }, [user]);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Workouts</h1>
        <p className="text-muted-foreground">Today's session and your training history</p>
      </div>

      <div className="mb-8">
        <TodayWorkout />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-primary" />
            Recent History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center">
              <Dumbbell className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="font-medium">No workouts logged yet</p>
              <p className="text-sm text-muted-foreground">Your completed sessions will appear here.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((row) => (
                <div
                  key={row.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {format(new Date(row.scheduled_date), "EEE, MMM d, yyyy")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {row.duration_minutes ?? 0} min · {row.completion_percentage ?? 0}% complete
                      </p>
                    </div>
                  </div>
                  <Badge variant={row.status === "completed" ? "default" : "secondary"}>
                    {row.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
