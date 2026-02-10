import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FitnessTimeline } from "@/components/timeline/FitnessTimeline";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { 
  Dumbbell,
  Eye,
  Edit,
  MessageSquare,
  Clock,
  User,
  Shield,
  CheckCircle,
  XCircle,
  Calendar,
  Loader2
} from "lucide-react";

interface WorkoutLogEntry {
  id: string;
  scheduled_date: string;
  status: string;
  duration_minutes: number | null;
  completion_percentage: number | null;
  started_at: string | null;
  completed_at: string | null;
  workout_id: string | null;
  user_notes: string | null;
}

interface AccessLogEntry {
  id: string;
  accessed_by: string;
  access_type: string;
  resource_type: string;
  accessed_at: string;
  duration_seconds: number | null;
}

const getAccessIcon = (type: string) => {
  switch (type) {
    case "view": return Eye;
    case "edit": return Edit;
    case "comment": return MessageSquare;
    default: return Eye;
  }
};

const getAccessColor = (type: string) => {
  switch (type) {
    case "view": return "bg-info/10 text-info";
    case "edit": return "bg-warning/10 text-warning";
    case "comment": return "bg-success/10 text-success";
    default: return "bg-muted text-muted-foreground";
  }
};

export default function Activity() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLogEntry[]>([]);
  const [accessLogs, setAccessLogs] = useState<AccessLogEntry[]>([]);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);

    const [workoutRes, accessRes] = await Promise.all([
      supabase
        .from("workout_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("scheduled_date", { ascending: false })
        .limit(50),
      supabase
        .from("access_audit_log")
        .select("*")
        .eq("user_id", user.id)
        .order("accessed_at", { ascending: false })
        .limit(50),
    ]);

    setWorkoutLogs(workoutRes.data || []);
    setAccessLogs(accessRes.data || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Activity</h1>
        <p className="text-muted-foreground">Your workout history and data access log.</p>
      </div>

      <Tabs defaultValue="workouts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="workouts">Workout History</TabsTrigger>
          <TabsTrigger value="access">Access Log</TabsTrigger>
          <TabsTrigger value="timeline">Fitness Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="workouts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-primary" />
                Workout History
              </CardTitle>
              <CardDescription>Your past workouts and completion status</CardDescription>
            </CardHeader>
            <CardContent>
              {workoutLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Dumbbell className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">No workouts yet</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-sm">
                    Your workout history will appear here once you start training.
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-3">
                    {workoutLogs.map((log) => {
                      const isCompleted = log.status === "completed";
                      const isMissed = log.status === "missed";
                      return (
                        <div
                          key={log.id}
                          className="flex items-center justify-between p-4 rounded-lg border bg-card"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isCompleted ? "bg-success/10" : isMissed ? "bg-destructive/10" : "bg-muted"
                            }`}>
                              {isCompleted ? (
                                <CheckCircle className="h-5 w-5 text-success" />
                              ) : isMissed ? (
                                <XCircle className="h-5 w-5 text-destructive" />
                              ) : (
                                <Clock className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">Workout Session</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {new Date(log.scheduled_date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={isCompleted ? "default" : isMissed ? "destructive" : "secondary"}>
                              {isCompleted ? "Completed" : isMissed ? "Missed" : log.status}
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-1">
                              {log.completion_percentage != null && `${log.completion_percentage}%`}
                              {log.duration_minutes != null && log.duration_minutes > 0 && ` • ${log.duration_minutes} min`}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Data Access Log
              </CardTitle>
              <CardDescription>Track who has accessed your fitness data</CardDescription>
            </CardHeader>
            <CardContent>
              {accessLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Shield className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">No access records</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-sm">
                    When trainers or gyms access your data, it will be logged here for transparency.
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-3">
                    {accessLogs.map((log) => {
                      const Icon = getAccessIcon(log.access_type);
                      return (
                        <div
                          key={log.id}
                          className="flex items-center justify-between p-4 rounded-lg border bg-card"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getAccessColor(log.access_type)}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium">{log.resource_type}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Badge variant="outline" className="text-xs capitalize">
                                  {log.access_type}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              <Clock className="h-3 w-3 inline mr-1" />
                              {new Date(log.accessed_at).toLocaleString()}
                            </p>
                            {log.duration_seconds != null && (
                              <p className="text-xs text-muted-foreground">
                                Duration: {Math.floor(log.duration_seconds / 60)}m {log.duration_seconds % 60}s
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <FitnessTimeline />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
