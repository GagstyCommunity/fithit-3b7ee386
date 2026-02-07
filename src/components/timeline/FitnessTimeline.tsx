import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { 
  Activity,
  Building2,
  User,
  Trophy,
  AlertTriangle,
  Calendar,
  Dumbbell,
  Target,
  TrendingUp
} from "lucide-react";
import { format } from "date-fns";

interface TimelineEvent {
  id: string;
  event_type: string;
  title: string;
  description: string | null;
  metadata: unknown;
  event_date: string;
  created_at: string;
}

const getEventIcon = (type: string) => {
  switch (type) {
    case "gym_joined":
    case "gym_left":
      return Building2;
    case "trainer_assigned":
    case "trainer_removed":
      return User;
    case "achievement":
      return Trophy;
    case "injury":
      return AlertTriangle;
    case "program_started":
    case "program_completed":
      return Dumbbell;
    case "goal_set":
    case "goal_completed":
      return Target;
    case "weight_milestone":
      return TrendingUp;
    default:
      return Activity;
  }
};

const getEventColor = (type: string) => {
  switch (type) {
    case "gym_joined":
    case "trainer_assigned":
    case "program_started":
      return "bg-primary/10 text-primary border-primary/20";
    case "gym_left":
    case "trainer_removed":
      return "bg-muted text-muted-foreground border-muted";
    case "achievement":
    case "goal_completed":
    case "weight_milestone":
      return "bg-success/10 text-success border-success/20";
    case "injury":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "program_completed":
      return "bg-info/10 text-info border-info/20";
    default:
      return "bg-muted text-muted-foreground border-muted";
  }
};

const getEventBadge = (type: string) => {
  const labels: Record<string, string> = {
    gym_joined: "Gym Joined",
    gym_left: "Gym Left",
    trainer_assigned: "Trainer Assigned",
    trainer_removed: "Trainer Removed",
    achievement: "Achievement",
    injury: "Injury",
    program_started: "Program Started",
    program_completed: "Program Completed",
    goal_set: "Goal Set",
    goal_completed: "Goal Completed",
    weight_milestone: "Milestone",
  };
  return labels[type] || type;
};

export function FitnessTimeline() {
  const { user } = useAuth();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchTimeline = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("timeline_events")
        .select("*")
        .eq("user_id", user.id)
        .order("event_date", { ascending: false });

      if (error) {
        console.error("Error fetching timeline:", error);
      } else {
        setEvents(data || []);
      }
      setLoading(false);
    };

    fetchTimeline();
  }, [user]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Fitness Timeline
          </CardTitle>
          <CardDescription>Your complete fitness journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Fitness Timeline
          </CardTitle>
          <CardDescription>Your complete fitness journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-lg mb-2">Your Journey Begins</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              As you progress, your fitness milestones, gym memberships, trainer assignments, 
              and achievements will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Fitness Timeline
        </CardTitle>
        <CardDescription>
          Your complete fitness journey • {events.length} events
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />
            
            <div className="space-y-6">
              {events.map((event, index) => {
                const Icon = getEventIcon(event.event_type);
                const colorClass = getEventColor(event.event_type);
                
                return (
                  <div key={event.id} className="relative pl-12">
                    {/* Timeline dot */}
                    <div className={`absolute left-2.5 top-1 w-5 h-5 rounded-full border-2 bg-background flex items-center justify-center ${colorClass}`}>
                      <Icon className="h-3 w-3" />
                    </div>
                    
                    {/* Event card */}
                    <div className={`p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow`}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-medium">{event.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {getEventBadge(event.event_type)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(event.event_date), "MMM d, yyyy")}
                        </div>
                      </div>
                      {event.description && (
                        <p className="text-sm text-muted-foreground">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}