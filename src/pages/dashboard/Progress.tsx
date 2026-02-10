import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { 
  TrendingUp, 
  TrendingDown, 
  Scale, 
  Ruler, 
  Trophy, 
  Flame,
  Calendar,
  Plus,
  Loader2
} from "lucide-react";

interface WeightEntry {
  id: string;
  weight_kg: number;
  recorded_at: string;
  notes: string | null;
}

interface Achievement {
  id: string;
  title: string;
  description: string | null;
  achievement_type: string;
  earned_at: string;
}

interface FitnessRecord {
  height_cm: number | null;
  current_weight_kg: number | null;
  body_fat_percentage: number | null;
}

export default function Progress() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [fitnessRecord, setFitnessRecord] = useState<FitnessRecord | null>(null);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [thisMonthWorkouts, setThisMonthWorkouts] = useState(0);
  const [logDialogOpen, setLogDialogOpen] = useState(false);
  const [newWeight, setNewWeight] = useState("");
  const [newWeightNote, setNewWeightNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) fetchAll();
  }, [user]);

  const fetchAll = async () => {
    if (!user) return;
    setLoading(true);

    const [weightRes, achieveRes, fitnessRes, totalRes, monthRes] = await Promise.all([
      supabase
        .from("weight_history")
        .select("*")
        .eq("user_id", user.id)
        .order("recorded_at", { ascending: false })
        .limit(20),
      supabase
        .from("achievements")
        .select("*")
        .eq("user_id", user.id)
        .order("earned_at", { ascending: false }),
      supabase
        .from("fitness_records")
        .select("height_cm, current_weight_kg, body_fat_percentage")
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase
        .from("workout_logs")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "completed"),
      supabase
        .from("workout_logs")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "completed")
        .gte("scheduled_date", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0]),
    ]);

    setWeightHistory(weightRes.data || []);
    setAchievements(achieveRes.data || []);
    setFitnessRecord(fitnessRes.data || null);
    setTotalWorkouts(totalRes.count || 0);
    setThisMonthWorkouts(monthRes.count || 0);
    setLoading(false);
  };

  const handleLogWeight = async () => {
    if (!user || !newWeight) return;
    setSaving(true);

    const weightKg = parseFloat(newWeight);
    const { error } = await supabase.from("weight_history").insert({
      user_id: user.id,
      weight_kg: weightKg,
      notes: newWeightNote || null,
    });

    if (error) {
      toast.error("Failed to log weight");
    } else {
      // Update fitness record
      await supabase
        .from("fitness_records")
        .update({ current_weight_kg: weightKg })
        .eq("user_id", user.id);

      toast.success("Weight logged!");
      setLogDialogOpen(false);
      setNewWeight("");
      setNewWeightNote("");
      fetchAll();
    }
    setSaving(false);
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

  const currentWeight = weightHistory[0]?.weight_kg || fitnessRecord?.current_weight_kg || 0;
  const startWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight_kg : currentWeight;
  const weightChange = startWeight - currentWeight;
  const isLosingWeight = weightChange > 0;
  const heightM = (fitnessRecord?.height_cm || 170) / 100;
  const bmi = currentWeight > 0 ? currentWeight / (heightM * heightM) : 0;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Progress</h1>
        <p className="text-muted-foreground">Track your fitness journey and achievements.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Weight</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentWeight > 0 ? `${currentWeight} kg` : "--"}</div>
            {weightHistory.length > 1 && (
              <div className="flex items-center gap-1 text-sm">
                {isLosingWeight ? (
                  <>
                    <TrendingDown className="h-4 w-4 text-green-500" />
                    <span className="text-green-500">-{weightChange.toFixed(1)} kg</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-4 w-4 text-orange-500" />
                    <span className="text-orange-500">+{Math.abs(weightChange).toFixed(1)} kg</span>
                  </>
                )}
                <span className="text-muted-foreground">total</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">BMI</CardTitle>
            <Ruler className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bmi > 0 ? bmi.toFixed(1) : "--"}</div>
            <p className="text-xs text-muted-foreground">
              {bmi === 0 ? "N/A" : bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Achievements</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{achievements.length}</div>
            <p className="text-xs text-muted-foreground">Earned badges</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Workouts</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWorkouts}</div>
            <p className="text-xs text-muted-foreground">{thisMonthWorkouts} this month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="weight" className="space-y-6">
        <TabsList>
          <TabsTrigger value="weight">Weight History</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="body">Body Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="weight" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Weight History</CardTitle>
                <CardDescription>Track your weight over time</CardDescription>
              </div>
              <Dialog open={logDialogOpen} onOpenChange={setLogDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Log Weight
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Log Weight</DialogTitle>
                    <DialogDescription>Record your current weight.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Weight (kg)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="75.0"
                        value={newWeight}
                        onChange={(e) => setNewWeight(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Note (optional)</Label>
                      <Input
                        placeholder="After morning workout..."
                        value={newWeightNote}
                        onChange={(e) => setNewWeightNote(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setLogDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleLogWeight} disabled={saving || !newWeight}>
                      {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {weightHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Scale className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No weight entries yet. Log your first weight!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {weightHistory.map((entry, index) => {
                    const prevWeight = weightHistory[index + 1]?.weight_kg;
                    const change = prevWeight ? entry.weight_kg - prevWeight : 0;
                    return (
                      <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Scale className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{entry.weight_kg} kg</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(entry.recorded_at).toLocaleDateString()}
                            </p>
                            {entry.notes && (
                              <p className="text-xs text-muted-foreground">{entry.notes}</p>
                            )}
                          </div>
                        </div>
                        {change !== 0 && (
                          <Badge variant={change < 0 ? "default" : "secondary"}>
                            {change > 0 ? "+" : ""}{change.toFixed(1)} kg
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Your fitness milestones</CardDescription>
            </CardHeader>
            <CardContent>
              {achievements.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No achievements yet. Keep training!</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {achievements.map((a) => (
                    <div key={a.id} className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Trophy className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{a.title}</p>
                        <p className="text-sm text-muted-foreground">{a.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(a.earned_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="body" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Body Measurements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Height</span>
                  <span className="font-medium">{fitnessRecord?.height_cm ? `${fitnessRecord.height_cm} cm` : "Not set"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Current Weight</span>
                  <span className="font-medium">{currentWeight > 0 ? `${currentWeight} kg` : "Not set"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">BMI</span>
                  <span className="font-medium">{bmi > 0 ? bmi.toFixed(1) : "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Body Fat %</span>
                  <span className="font-medium">
                    {fitnessRecord?.body_fat_percentage ? `${fitnessRecord.body_fat_percentage}%` : "Not set"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Weight Trend</CardTitle>
              </CardHeader>
              <CardContent>
                {weightHistory.length < 2 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Log at least 2 weights to see your trend.
                  </p>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>First: {startWeight} kg</span>
                      <span>Current: {currentWeight} kg</span>
                    </div>
                    <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                      <div
                        className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all"
                        style={{ width: `${Math.min(100, Math.abs(weightChange / startWeight) * 100 * 10)}%` }}
                      />
                    </div>
                    <div className="text-center">
                      <p className={`text-2xl font-bold ${isLosingWeight ? "text-green-500" : "text-orange-500"}`}>
                        {isLosingWeight ? "-" : "+"}{Math.abs(weightChange).toFixed(1)} kg
                      </p>
                      <p className="text-sm text-muted-foreground">total change</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
