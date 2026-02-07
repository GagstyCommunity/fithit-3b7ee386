import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Dumbbell,
  Calendar,
  Save,
  User,
  Search
} from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  body_part: string;
  category: string;
  equipment: string[];
  description: string | null;
}

interface WorkoutExercise {
  id: string;
  exercise: Exercise;
  sets: number;
  reps: string;
  weightPerSide: number | null;
  restSeconds: number;
  trainerNote: string;
}

interface DailyWorkout {
  id: string;
  dayOfWeek: number;
  name: string;
  estimatedDuration: number;
  safetyNotes: string;
  exercises: WorkoutExercise[];
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const BODY_PARTS = ["chest", "back", "shoulders", "biceps", "triceps", "quads", "hamstrings", "glutes", "calves", "core", "cardio", "mobility"];

export function ProgramBuilder() {
  const { user } = useAuth();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBodyPart, setSelectedBodyPart] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  
  // Program form state
  const [programName, setProgramName] = useState("");
  const [programDescription, setProgramDescription] = useState("");
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [clients, setClients] = useState<Array<{id: string; full_name: string | null; email: string}>>([]);
  
  // Weekly split
  const [weeklyWorkouts, setWeeklyWorkouts] = useState<DailyWorkout[]>([
    { id: "1", dayOfWeek: 1, name: "Push Day", estimatedDuration: 60, safetyNotes: "", exercises: [] },
    { id: "2", dayOfWeek: 3, name: "Pull Day", estimatedDuration: 60, safetyNotes: "", exercises: [] },
    { id: "3", dayOfWeek: 5, name: "Leg Day", estimatedDuration: 60, safetyNotes: "", exercises: [] },
  ]);
  
  const [activeDay, setActiveDay] = useState<string>("1");
  const [exerciseDialogOpen, setExerciseDialogOpen] = useState(false);

  // Fetch exercises and clients
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setLoading(true);
      
      // Fetch exercises
      const { data: exerciseData, error: exerciseError } = await supabase
        .from("exercises")
        .select("*")
        .order("name");
      
      if (exerciseError) {
        console.error("Error fetching exercises:", exerciseError);
      } else {
        setExercises(exerciseData || []);
        setFilteredExercises(exerciseData || []);
      }
      
      // Fetch trainer's clients - get client IDs first, then profiles separately
      const { data: clientRelations, error: clientError } = await supabase
        .from("trainer_clients")
        .select("client_id")
        .eq("trainer_id", user.id)
        .eq("status", "active");
      
      if (clientError) {
        console.error("Error fetching clients:", clientError);
      } else if (clientRelations && clientRelations.length > 0) {
        const clientIds = clientRelations.map(c => c.client_id);
        
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("user_id, full_name, email")
          .in("user_id", clientIds);
        
        if (profileError) {
          console.error("Error fetching profiles:", profileError);
        } else if (profileData) {
          const formattedClients = profileData.map(p => ({
            id: p.user_id,
            full_name: p.full_name,
            email: p.email
          }));
          setClients(formattedClients);
        }
      }
      
      setLoading(false);
    };
    
    fetchData();
  }, [user]);

  // Filter exercises
  useEffect(() => {
    let filtered = exercises;
    
    if (searchQuery) {
      filtered = filtered.filter(e => 
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.body_part.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedBodyPart !== "all") {
      filtered = filtered.filter(e => e.body_part === selectedBodyPart);
    }
    
    setFilteredExercises(filtered);
  }, [searchQuery, selectedBodyPart, exercises]);

  const addExerciseToWorkout = (exercise: Exercise) => {
    setWeeklyWorkouts(prev => prev.map(workout => {
      if (workout.id === activeDay) {
        return {
          ...workout,
          exercises: [
            ...workout.exercises,
            {
              id: crypto.randomUUID(),
              exercise,
              sets: 3,
              reps: "10",
              weightPerSide: null,
              restSeconds: 60,
              trainerNote: ""
            }
          ]
        };
      }
      return workout;
    }));
    setExerciseDialogOpen(false);
    toast.success(`Added ${exercise.name}`);
  };

  const removeExerciseFromWorkout = (exerciseId: string) => {
    setWeeklyWorkouts(prev => prev.map(workout => {
      if (workout.id === activeDay) {
        return {
          ...workout,
          exercises: workout.exercises.filter(e => e.id !== exerciseId)
        };
      }
      return workout;
    }));
  };

  const updateExerciseInWorkout = (exerciseId: string, field: string, value: unknown) => {
    setWeeklyWorkouts(prev => prev.map(workout => {
      if (workout.id === activeDay) {
        return {
          ...workout,
          exercises: workout.exercises.map(e => 
            e.id === exerciseId ? { ...e, [field]: value } : e
          )
        };
      }
      return workout;
    }));
  };

  const updateWorkoutDay = (field: string, value: unknown) => {
    setWeeklyWorkouts(prev => prev.map(workout => 
      workout.id === activeDay ? { ...workout, [field]: value } : workout
    ));
  };

  const addWorkoutDay = () => {
    const usedDays = weeklyWorkouts.map(w => w.dayOfWeek);
    const availableDays = [0, 1, 2, 3, 4, 5, 6].filter(d => !usedDays.includes(d));
    
    if (availableDays.length === 0) {
      toast.error("All days already have workouts");
      return;
    }
    
    const newWorkout: DailyWorkout = {
      id: crypto.randomUUID(),
      dayOfWeek: availableDays[0],
      name: "New Workout",
      estimatedDuration: 60,
      safetyNotes: "",
      exercises: []
    };
    
    setWeeklyWorkouts(prev => [...prev, newWorkout]);
    setActiveDay(newWorkout.id);
  };

  const removeWorkoutDay = (workoutId: string) => {
    if (weeklyWorkouts.length <= 1) {
      toast.error("You need at least one workout day");
      return;
    }
    
    setWeeklyWorkouts(prev => prev.filter(w => w.id !== workoutId));
    if (activeDay === workoutId) {
      setActiveDay(weeklyWorkouts[0].id);
    }
  };

  const handleSaveProgram = async () => {
    if (!user) return;
    if (!programName) {
      toast.error("Please enter a program name");
      return;
    }
    if (!selectedClient) {
      toast.error("Please select a client");
      return;
    }

    setLoading(true);
    
    try {
      // Create program
      const { data: program, error: programError } = await supabase
        .from("workout_programs")
        .insert({
          trainer_id: user.id,
          client_id: selectedClient,
          name: programName,
          description: programDescription,
          duration_weeks: durationWeeks,
          status: "active",
          start_date: new Date().toISOString().split("T")[0]
        })
        .select()
        .single();

      if (programError) throw programError;

      // Create week 1 split
      const { data: split, error: splitError } = await supabase
        .from("weekly_splits")
        .insert({
          program_id: program.id,
          week_number: 1,
          name: "Week 1"
        })
        .select()
        .single();

      if (splitError) throw splitError;

      // Create daily workouts
      for (const workout of weeklyWorkouts) {
        const { data: dailyWorkout, error: workoutError } = await supabase
          .from("daily_workouts")
          .insert({
            split_id: split.id,
            day_of_week: workout.dayOfWeek,
            name: workout.name,
            estimated_duration: workout.estimatedDuration,
            safety_notes: workout.safetyNotes || null
          })
          .select()
          .single();

        if (workoutError) throw workoutError;

        // Create workout exercises
        if (workout.exercises.length > 0) {
          const exercisesToInsert = workout.exercises.map((e, index) => ({
            workout_id: dailyWorkout.id,
            exercise_id: e.exercise.id,
            order_index: index,
            sets: e.sets,
            reps: e.reps,
            weight_per_side: e.weightPerSide,
            rest_seconds: e.restSeconds,
            trainer_note: e.trainerNote || null
          }));

          const { error: exerciseError } = await supabase
            .from("workout_exercises")
            .insert(exercisesToInsert);

          if (exerciseError) throw exerciseError;
        }
      }

      // Add timeline event for client
      await supabase.from("timeline_events").insert({
        user_id: selectedClient,
        event_type: "program_started",
        title: `New Program: ${programName}`,
        description: `Your trainer assigned you a new ${durationWeeks}-week program`,
        event_date: new Date().toISOString().split("T")[0]
      });

      toast.success("Program created successfully!");
      
      // Reset form
      setProgramName("");
      setProgramDescription("");
      setSelectedClient("");
      setWeeklyWorkouts([
        { id: "1", dayOfWeek: 1, name: "Push Day", estimatedDuration: 60, safetyNotes: "", exercises: [] },
        { id: "2", dayOfWeek: 3, name: "Pull Day", estimatedDuration: 60, safetyNotes: "", exercises: [] },
        { id: "3", dayOfWeek: 5, name: "Leg Day", estimatedDuration: 60, safetyNotes: "", exercises: [] },
      ]);
      
    } catch (error) {
      console.error("Error saving program:", error);
      toast.error("Failed to save program");
    } finally {
      setLoading(false);
    }
  };

  const activeWorkout = weeklyWorkouts.find(w => w.id === activeDay);

  return (
    <div className="space-y-6">
      {/* Program Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Create Training Program
          </CardTitle>
          <CardDescription>
            Design a complete training program for your client
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="programName">Program Name *</Label>
              <Input
                id="programName"
                placeholder="e.g., Strength Foundation"
                value={programName}
                onChange={(e) => setProgramName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client">Client *</Label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">
                      No clients yet. Add clients first.
                    </div>
                  ) : (
                    clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {client.full_name || client.email}
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (weeks)</Label>
              <Select value={durationWeeks.toString()} onValueChange={(v) => setDurationWeeks(parseInt(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[4, 6, 8, 10, 12].map(w => (
                    <SelectItem key={w} value={w.toString()}>{w} weeks</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                placeholder="Brief program description..."
                value={programDescription}
                onChange={(e) => setProgramDescription(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Split */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Weekly Split</CardTitle>
              <CardDescription>Design workouts for each training day</CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={addWorkoutDay}>
              <Plus className="h-4 w-4 mr-1" />
              Add Day
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeDay} onValueChange={setActiveDay}>
            <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
              {weeklyWorkouts.map(workout => (
                <TabsTrigger
                  key={workout.id}
                  value={workout.id}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {DAYS[workout.dayOfWeek].slice(0, 3)}
                </TabsTrigger>
              ))}
            </TabsList>

            {weeklyWorkouts.map(workout => (
              <TabsContent key={workout.id} value={workout.id} className="space-y-4 mt-4">
                {/* Workout day settings */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Day</Label>
                    <Select 
                      value={workout.dayOfWeek.toString()} 
                      onValueChange={(v) => updateWorkoutDay("dayOfWeek", parseInt(v))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DAYS.map((day, i) => (
                          <SelectItem key={i} value={i.toString()}>{day}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Workout Name</Label>
                    <Input
                      value={workout.name}
                      onChange={(e) => updateWorkoutDay("name", e.target.value)}
                      placeholder="e.g., Upper Body"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Duration (min)</Label>
                    <Input
                      type="number"
                      value={workout.estimatedDuration}
                      onChange={(e) => updateWorkoutDay("estimatedDuration", parseInt(e.target.value))}
                    />
                  </div>
                </div>

                {/* Exercises list */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Exercises ({workout.exercises.length})</Label>
                    <Dialog open={exerciseDialogOpen} onOpenChange={setExerciseDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Add Exercise
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh]">
                        <DialogHeader>
                          <DialogTitle>Add Exercise</DialogTitle>
                          <DialogDescription>
                            Search and select an exercise from the library
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="Search exercises..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                              />
                            </div>
                            <Select value={selectedBodyPart} onValueChange={setSelectedBodyPart}>
                              <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Body part" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                {BODY_PARTS.map(part => (
                                  <SelectItem key={part} value={part} className="capitalize">
                                    {part}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <ScrollArea className="h-[400px]">
                            <div className="space-y-2">
                              {filteredExercises.map(exercise => (
                                <button
                                  key={exercise.id}
                                  onClick={() => addExerciseToWorkout(exercise)}
                                  className="w-full p-3 rounded-lg border bg-card hover:bg-muted text-left transition-colors"
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="font-medium">{exercise.name}</p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="outline" className="text-xs capitalize">
                                          {exercise.body_part}
                                        </Badge>
                                        {exercise.equipment?.slice(0, 2).map(eq => (
                                          <Badge key={eq} variant="secondary" className="text-xs">
                                            {eq}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                    <Plus className="h-5 w-5 text-muted-foreground" />
                                  </div>
                                </button>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {workout.exercises.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground border rounded-lg border-dashed">
                      <Dumbbell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No exercises yet. Click "Add Exercise" to start.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {workout.exercises.map((ex, index) => (
                        <div
                          key={ex.id}
                          className="flex items-start gap-3 p-3 rounded-lg border bg-card"
                        >
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <GripVertical className="h-4 w-4" />
                            <span className="text-sm font-medium w-4">{index + 1}</span>
                          </div>
                          
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{ex.exercise.name}</p>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7"
                                onClick={() => removeExerciseFromWorkout(ex.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-4 gap-2">
                              <div className="space-y-1">
                                <Label className="text-xs">Sets</Label>
                                <Input
                                  type="number"
                                  value={ex.sets}
                                  onChange={(e) => updateExerciseInWorkout(ex.id, "sets", parseInt(e.target.value))}
                                  className="h-8"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Reps</Label>
                                <Input
                                  value={ex.reps}
                                  onChange={(e) => updateExerciseInWorkout(ex.id, "reps", e.target.value)}
                                  placeholder="10"
                                  className="h-8"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Weight (kg)</Label>
                                <Input
                                  type="number"
                                  value={ex.weightPerSide || ""}
                                  onChange={(e) => updateExerciseInWorkout(ex.id, "weightPerSide", e.target.value ? parseFloat(e.target.value) : null)}
                                  placeholder="0"
                                  className="h-8"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Rest (s)</Label>
                                <Input
                                  type="number"
                                  value={ex.restSeconds}
                                  onChange={(e) => updateExerciseInWorkout(ex.id, "restSeconds", parseInt(e.target.value))}
                                  className="h-8"
                                />
                              </div>
                            </div>
                            
                            <Input
                              placeholder="Trainer note (optional)"
                              value={ex.trainerNote}
                              onChange={(e) => updateExerciseInWorkout(ex.id, "trainerNote", e.target.value)}
                              className="h-8 text-sm"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Remove day button */}
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeWorkoutDay(workout.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove Day
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Save button */}
      <div className="flex justify-end">
        <Button size="lg" onClick={handleSaveProgram} disabled={loading}>
          <Save className="h-5 w-5 mr-2" />
          {loading ? "Saving..." : "Save Program"}
        </Button>
      </div>
    </div>
  );
}