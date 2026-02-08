import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { 
  Dumbbell, 
  Clock, 
  Play, 
  Square, 
  CheckCircle, 
  XCircle,
  Timer,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Loader2
} from "lucide-react";

interface WorkoutExercise {
  id: string;
  exercise_id: string;
  sets: number;
  reps: string;
  weight_per_side: number | null;
  total_weight: number | null;
  rest_seconds: number | null;
  trainer_note: string | null;
  order_index: number;
  exercise: {
    id: string;
    name: string;
    body_part: string;
    category: string;
    equipment: string[] | null;
    instructions: string[] | null;
  };
}

interface DailyWorkout {
  id: string;
  name: string;
  estimated_duration: number | null;
  safety_notes: string | null;
  trainer_notes_shared: string | null;
}

interface ExerciseLog {
  id: string;
  workout_exercise_id: string;
  status: string;
  sets_completed: number | null;
  actual_weight: number | null;
  actual_reps: string | null;
  user_note: string | null;
}

interface WorkoutLog {
  id: string;
  status: string;
  started_at: string | null;
  completed_at: string | null;
  duration_minutes: number | null;
  completion_percentage: number | null;
}

export function TodayWorkout() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [todayWorkout, setTodayWorkout] = useState<DailyWorkout | null>(null);
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [workoutLog, setWorkoutLog] = useState<WorkoutLog | null>(null);
  const [exerciseLogs, setExerciseLogs] = useState<Map<string, ExerciseLog>>(new Map());
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [currentExerciseForNote, setCurrentExerciseForNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTodayWorkout();
    }
  }, [user]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning) {
      interval = setInterval(() => {
        setWorkoutTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const fetchTodayWorkout = async () => {
    if (!user) return;
    setLoading(true);

    const today = new Date();
    const dayOfWeek = today.getDay();
    const todayDate = today.toISOString().split("T")[0];

    // Get user's active programs
    const { data: programs, error: programError } = await supabase
      .from("workout_programs")
      .select("id")
      .eq("client_id", user.id)
      .eq("status", "active");

    if (programError || !programs || programs.length === 0) {
      setLoading(false);
      return;
    }

    // Get weekly splits for active programs
    const { data: splits, error: splitError } = await supabase
      .from("weekly_splits")
      .select("id")
      .in("program_id", programs.map(p => p.id));

    if (splitError || !splits || splits.length === 0) {
      setLoading(false);
      return;
    }

    // Get today's workout
    const { data: workouts, error: workoutError } = await supabase
      .from("daily_workouts")
      .select(`
        id,
        name,
        estimated_duration,
        safety_notes,
        trainer_notes_shared
      `)
      .in("split_id", splits.map(s => s.id))
      .eq("day_of_week", dayOfWeek);

    if (workoutError || !workouts || workouts.length === 0) {
      setLoading(false);
      return;
    }

    const workout = workouts[0];
    setTodayWorkout(workout);

    // Get exercises for this workout
    const { data: exerciseData, error: exerciseError } = await supabase
      .from("workout_exercises")
      .select(`
        id,
        exercise_id,
        sets,
        reps,
        weight_per_side,
        total_weight,
        rest_seconds,
        trainer_note,
        order_index,
        exercise:exercises (
          id,
          name,
          body_part,
          category,
          equipment,
          instructions
        )
      `)
      .eq("workout_id", workout.id)
      .order("order_index");

    if (!exerciseError && exerciseData) {
      // Type assertion to handle the nested exercise properly
      const typedExercises = exerciseData.map(e => ({
        ...e,
        exercise: e.exercise as unknown as WorkoutExercise['exercise']
      }));
      setExercises(typedExercises);
    }

    // Check for existing workout log for today
    const { data: existingLog, error: logError } = await supabase
      .from("workout_logs")
      .select("*")
      .eq("user_id", user.id)
      .eq("workout_id", workout.id)
      .eq("scheduled_date", todayDate)
      .maybeSingle();

    if (!logError && existingLog) {
      setWorkoutLog(existingLog);
      if (existingLog.status === "in_progress" && existingLog.started_at) {
        const startTime = new Date(existingLog.started_at).getTime();
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setWorkoutTimer(elapsed);
        setTimerRunning(true);
      }

      // Fetch exercise logs
      const { data: exLogs } = await supabase
        .from("exercise_logs")
        .select("*")
        .eq("workout_log_id", existingLog.id);

      if (exLogs) {
        const logMap = new Map<string, ExerciseLog>();
        exLogs.forEach(log => logMap.set(log.workout_exercise_id, log));
        setExerciseLogs(logMap);
      }
    }

    setLoading(false);
  };

  const startWorkout = async () => {
    if (!user || !todayWorkout) return;

    const todayDate = new Date().toISOString().split("T")[0];

    const { data: newLog, error } = await supabase
      .from("workout_logs")
      .insert({
        user_id: user.id,
        workout_id: todayWorkout.id,
        scheduled_date: todayDate,
        status: "in_progress",
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to start workout");
      return;
    }

    setWorkoutLog(newLog);
    setTimerRunning(true);
    toast.success("Workout started! Let's go! 💪");
  };

  const endWorkout = async () => {
    if (!workoutLog) return;

    const completedCount = Array.from(exerciseLogs.values()).filter(
      l => l.status === "completed"
    ).length;
    const completionPercentage = exercises.length > 0 
      ? Math.round((completedCount / exercises.length) * 100) 
      : 0;

    const { error } = await supabase
      .from("workout_logs")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        duration_minutes: Math.floor(workoutTimer / 60),
        completion_percentage: completionPercentage,
      })
      .eq("id", workoutLog.id);

    if (error) {
      toast.error("Failed to complete workout");
      return;
    }

    setTimerRunning(false);
    setWorkoutLog(prev => prev ? { ...prev, status: "completed" } : null);

    // Add timeline event
    await supabase.from("timeline_events").insert({
      user_id: user?.id,
      event_type: "workout_completed",
      title: `Completed: ${todayWorkout?.name}`,
      description: `${completionPercentage}% completion in ${Math.floor(workoutTimer / 60)} minutes`,
      event_date: new Date().toISOString().split("T")[0],
    });

    toast.success(`Workout complete! ${completionPercentage}% of exercises done 🎉`);
  };

  const updateExerciseStatus = async (exerciseId: string, status: "completed" | "skipped") => {
    if (!workoutLog) return;

    const existingLog = exerciseLogs.get(exerciseId);

    if (existingLog) {
      await supabase
        .from("exercise_logs")
        .update({ status })
        .eq("id", existingLog.id);
    } else {
      const { data: newLog } = await supabase
        .from("exercise_logs")
        .insert({
          workout_log_id: workoutLog.id,
          workout_exercise_id: exerciseId,
          status,
        })
        .select()
        .single();

      if (newLog) {
        setExerciseLogs(prev => new Map(prev).set(exerciseId, newLog));
      }
    }

    setExerciseLogs(prev => {
      const updated = new Map(prev);
      const log = updated.get(exerciseId);
      if (log) {
        updated.set(exerciseId, { ...log, status });
      }
      return updated;
    });
  };

  const addExerciseNote = async () => {
    if (!currentExerciseForNote || !workoutLog) return;

    const existingLog = exerciseLogs.get(currentExerciseForNote);

    if (existingLog) {
      await supabase
        .from("exercise_logs")
        .update({ user_note: noteText })
        .eq("id", existingLog.id);
    } else {
      const { data: newLog } = await supabase
        .from("exercise_logs")
        .insert({
          workout_log_id: workoutLog.id,
          workout_exercise_id: currentExerciseForNote,
          status: "pending",
          user_note: noteText,
        })
        .select()
        .single();

      if (newLog) {
        setExerciseLogs(prev => new Map(prev).set(currentExerciseForNote, newLog));
      }
    }

    setNoteDialogOpen(false);
    setNoteText("");
    toast.success("Note added");
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!todayWorkout) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Today's Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Dumbbell className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No workout for today</h3>
            <p className="text-muted-foreground text-center max-w-md">
              You don't have a workout assigned for today. Connect with a trainer to get personalized workout plans.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const completedCount = Array.from(exerciseLogs.values()).filter(l => l.status === "completed").length;
  const progress = exercises.length > 0 ? (completedCount / exercises.length) * 100 : 0;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-primary" />
                {todayWorkout.name}
              </CardTitle>
              <CardDescription className="flex items-center gap-4 mt-1">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {todayWorkout.estimated_duration || 60} min
                </span>
                <span>{exercises.length} exercises</span>
              </CardDescription>
            </div>
            {workoutLog?.status === "in_progress" && (
              <div className="text-right">
                <div className="flex items-center gap-2 text-2xl font-mono font-bold text-primary">
                  <Timer className="h-5 w-5" />
                  {formatTime(workoutTimer)}
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress bar */}
          {workoutLog && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{completedCount} / {exercises.length} exercises</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Trainer notes */}
          {todayWorkout.trainer_notes_shared && (
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-sm font-medium mb-1">Trainer Note</p>
              <p className="text-sm text-muted-foreground">{todayWorkout.trainer_notes_shared}</p>
            </div>
          )}

          {/* Safety notes */}
          {todayWorkout.safety_notes && (
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <p className="text-sm font-medium mb-1 text-yellow-600">⚠️ Safety Note</p>
              <p className="text-sm text-muted-foreground">{todayWorkout.safety_notes}</p>
            </div>
          )}

          {/* Start/End buttons */}
          <div className="flex gap-2">
            {!workoutLog && (
              <Button onClick={startWorkout} className="flex-1" size="lg">
                <Play className="h-4 w-4 mr-2" />
                Start Workout
              </Button>
            )}
            {workoutLog?.status === "in_progress" && (
              <Button onClick={endWorkout} variant="destructive" className="flex-1" size="lg">
                <Square className="h-4 w-4 mr-2" />
                End Workout
              </Button>
            )}
            {workoutLog?.status === "completed" && (
              <Badge variant="secondary" className="flex-1 justify-center py-3 bg-green-100 text-green-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                Workout Completed
              </Badge>
            )}
          </div>

          {/* Exercise list */}
          <div className="space-y-2">
            {exercises.map((ex, index) => {
              const log = exerciseLogs.get(ex.id);
              const isCompleted = log?.status === "completed";
              const isSkipped = log?.status === "skipped";
              const isExpanded = expandedExercise === ex.id;

              return (
                <div
                  key={ex.id}
                  className={`border rounded-lg transition-colors ${
                    isCompleted ? "bg-green-50 border-green-200" :
                    isSkipped ? "bg-muted/50 border-muted opacity-60" :
                    "bg-background"
                  }`}
                >
                  <div 
                    className="flex items-center justify-between p-3 cursor-pointer"
                    onClick={() => setExpandedExercise(isExpanded ? null : ex.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <div>
                        <p className={`font-medium ${isSkipped ? "line-through" : ""}`}>
                          {ex.exercise.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {ex.sets} × {ex.reps} reps
                          {ex.weight_per_side && ` @ ${ex.weight_per_side}kg/side`}
                          {ex.total_weight && !ex.weight_per_side && ` @ ${ex.total_weight}kg`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isCompleted && <CheckCircle className="h-5 w-5 text-green-500" />}
                      {isSkipped && <XCircle className="h-5 w-5 text-muted-foreground" />}
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-3 pb-3 space-y-3 border-t">
                      {/* Exercise details */}
                      <div className="pt-3 grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 rounded bg-muted">
                          <p className="text-xs text-muted-foreground">Sets</p>
                          <p className="font-semibold">{ex.sets}</p>
                        </div>
                        <div className="p-2 rounded bg-muted">
                          <p className="text-xs text-muted-foreground">Reps</p>
                          <p className="font-semibold">{ex.reps}</p>
                        </div>
                        <div className="p-2 rounded bg-muted">
                          <p className="text-xs text-muted-foreground">Rest</p>
                          <p className="font-semibold">{ex.rest_seconds || 60}s</p>
                        </div>
                      </div>

                      {/* Trainer note */}
                      {ex.trainer_note && (
                        <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                          💡 {ex.trainer_note}
                        </p>
                      )}

                      {/* Instructions */}
                      {ex.exercise.instructions && ex.exercise.instructions.length > 0 && (
                        <div className="text-sm">
                          <p className="font-medium mb-1">How to:</p>
                          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                            {ex.exercise.instructions.slice(0, 3).map((inst, i) => (
                              <li key={i}>{inst}</li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {/* User note */}
                      {log?.user_note && (
                        <p className="text-sm text-muted-foreground bg-primary/5 p-2 rounded">
                          📝 {log.user_note}
                        </p>
                      )}

                      {/* Actions */}
                      {workoutLog?.status === "in_progress" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={isCompleted ? "secondary" : "default"}
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateExerciseStatus(ex.id, "completed");
                            }}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            {isCompleted ? "Done" : "Complete"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateExerciseStatus(ex.id, "skipped");
                            }}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Skip
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentExerciseForNote(ex.id);
                              setNoteText(log?.user_note || "");
                              setNoteDialogOpen(true);
                            }}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Note dialog */}
      <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Pain issue, equipment problem, weight adjustment..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            rows={3}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setNoteDialogOpen(false)}>Cancel</Button>
            <Button onClick={addExerciseNote}>Save Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
