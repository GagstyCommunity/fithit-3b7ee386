import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Plus, Trash2, Dumbbell, Search, Save, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Exercise {
  id: string;
  name: string;
  body_part: string;
  category: string;
}

interface PickedExercise extends Exercise {
  sets: number;
  reps: string;
  weight: string;
}

export default function QuickWorkout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [bodyPart, setBodyPart] = useState<string>("all");
  const [picked, setPicked] = useState<PickedExercise[]>([]);
  const [name, setName] = useState("My Workout");
  const [duration, setDuration] = useState("45");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("exercises")
        .select("id, name, body_part, category")
        .eq("is_global", true)
        .order("name")
        .limit(500);
      setExercises(data || []);
      setLoading(false);
    })();
  }, []);

  const bodyParts = useMemo(
    () => Array.from(new Set(exercises.map((e) => e.body_part))).sort(),
    [exercises]
  );

  const filtered = useMemo(() => {
    return exercises.filter((e) => {
      if (bodyPart !== "all" && e.body_part !== bodyPart) return false;
      if (search && !e.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    }).slice(0, 100);
  }, [exercises, bodyPart, search]);

  const addExercise = (ex: Exercise) => {
    if (picked.find((p) => p.id === ex.id)) {
      toast.info("Already added");
      return;
    }
    setPicked((prev) => [...prev, { ...ex, sets: 3, reps: "10", weight: "" }]);
  };

  const updatePicked = (id: string, patch: Partial<PickedExercise>) => {
    setPicked((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const removePicked = (id: string) => setPicked((prev) => prev.filter((p) => p.id !== id));

  const logWorkout = async () => {
    if (!user) return;
    if (picked.length === 0) {
      toast.error("Add at least one exercise");
      return;
    }
    setSaving(true);
    const today = new Date().toISOString().split("T")[0];
    const summary = picked
      .map((p) => `${p.name}: ${p.sets}×${p.reps}${p.weight ? ` @ ${p.weight}kg` : ""}`)
      .join("\n");

    const { error } = await supabase.from("workout_logs").insert({
      user_id: user.id,
      scheduled_date: today,
      status: "completed",
      started_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
      duration_minutes: parseInt(duration) || 45,
      completion_percentage: 100,
      user_notes: `${name}\n\n${summary}`,
    });

    if (error) {
      toast.error(error.message);
      setSaving(false);
      return;
    }

    await supabase.from("timeline_events").insert({
      user_id: user.id,
      event_type: "workout_completed",
      title: `Self-logged: ${name}`,
      description: `${picked.length} exercises · ${duration} min`,
      event_date: today,
    });

    toast.success("Workout logged! 💪");
    navigate("/dashboard/workouts");
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">Quick Workout</h1>
        <p className="text-sm text-muted-foreground">
          No trainer? No problem. Pick exercises from the library and log your session.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Library */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Dumbbell className="h-5 w-5 text-primary" />
              Exercise Library
            </CardTitle>
            <CardDescription>Tap an exercise to add it to your workout</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search exercise"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={bodyPart} onValueChange={setBodyPart}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All parts</SelectItem>
                  {bodyParts.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <ScrollArea className="h-[420px] pr-2">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  No exercises found.
                </p>
              ) : (
                <div className="space-y-1">
                  {filtered.map((ex) => (
                    <button
                      key={ex.id}
                      onClick={() => addExercise(ex)}
                      className="w-full flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 text-left transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium">{ex.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {ex.body_part} · {ex.category}
                        </p>
                      </div>
                      <Plus className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Builder */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Workout</CardTitle>
            <CardDescription>Set sets, reps and weight, then log it</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <Input
                className="col-span-2"
                placeholder="Workout name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Min"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>

            {picked.length === 0 ? (
              <div className="border border-dashed rounded-lg py-12 text-center text-sm text-muted-foreground">
                No exercises added yet
              </div>
            ) : (
              <div className="space-y-2">
                {picked.map((p) => (
                  <div key={p.id} className="p-3 rounded-lg border bg-card space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{p.name}</p>
                        <Badge variant="outline" className="text-xs mt-0.5 capitalize">
                          {p.body_part}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removePicked(p.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs text-muted-foreground">Sets</label>
                        <Input
                          type="number"
                          value={p.sets}
                          onChange={(e) =>
                            updatePicked(p.id, { sets: parseInt(e.target.value) || 0 })
                          }
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Reps</label>
                        <Input
                          value={p.reps}
                          onChange={(e) => updatePicked(p.id, { reps: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Weight (kg)</label>
                        <Input
                          value={p.weight}
                          placeholder="—"
                          onChange={(e) => updatePicked(p.id, { weight: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Button
              className="w-full"
              size="lg"
              onClick={logWorkout}
              disabled={saving || picked.length === 0}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Log Workout ({picked.length})
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
