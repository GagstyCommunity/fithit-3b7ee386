import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Target, Plus, TrendingUp, Dumbbell, Heart, Zap, Activity, Loader2, Trash2, CheckCircle } from "lucide-react";

const goalTypes = [
  { value: "fat_loss", label: "Fat Loss", icon: TrendingUp, color: "text-orange-500" },
  { value: "muscle_gain", label: "Muscle Gain", icon: Dumbbell, color: "text-blue-500" },
  { value: "strength", label: "Strength", icon: Zap, color: "text-yellow-500" },
  { value: "endurance", label: "Endurance", icon: Activity, color: "text-green-500" },
  { value: "rehab", label: "Rehabilitation", icon: Heart, color: "text-red-500" },
  { value: "general", label: "General Fitness", icon: Target, color: "text-primary" },
];

interface FitnessGoal {
  id: string;
  goal_type: string;
  title: string;
  description: string | null;
  target_value: number | null;
  current_value: number | null;
  target_unit: string | null;
  target_date: string | null;
  status: string;
  created_at: string;
}

export default function Goals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<FitnessGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form state
  const [goalType, setGoalType] = useState("general");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [targetUnit, setTargetUnit] = useState("");
  const [targetDate, setTargetDate] = useState("");

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("fitness_goals")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching goals:", error);
      toast.error("Failed to load goals");
    } else {
      setGoals(data || []);
    }
    setLoading(false);
  };

  const handleCreateGoal = async () => {
    if (!user || !title) {
      toast.error("Please enter a goal title");
      return;
    }

    setSaving(true);
    const { error } = await supabase.from("fitness_goals").insert({
      user_id: user.id,
      goal_type: goalType,
      title,
      description: description || null,
      target_value: targetValue ? parseFloat(targetValue) : null,
      target_unit: targetUnit || null,
      target_date: targetDate || null,
      current_value: 0,
      status: "active",
    });

    if (error) {
      console.error("Error creating goal:", error);
      toast.error("Failed to create goal");
    } else {
      toast.success("Goal created!");
      setDialogOpen(false);
      resetForm();
      fetchGoals();
    }
    setSaving(false);
  };

  const handleUpdateProgress = async (goalId: string, newValue: number) => {
    const { error } = await supabase
      .from("fitness_goals")
      .update({ current_value: newValue })
      .eq("id", goalId);

    if (error) {
      toast.error("Failed to update progress");
    } else {
      toast.success("Progress updated!");
      fetchGoals();
    }
  };

  const handleCompleteGoal = async (goalId: string) => {
    const { error } = await supabase
      .from("fitness_goals")
      .update({ status: "completed" })
      .eq("id", goalId);

    if (error) {
      toast.error("Failed to complete goal");
    } else {
      toast.success("Goal completed! 🎉");
      fetchGoals();

      // Add achievement
      await supabase.from("achievements").insert({
        user_id: user?.id,
        achievement_type: "goal_completed",
        title: "Goal Achieved",
        description: "Completed a fitness goal",
      });
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    const { error } = await supabase
      .from("fitness_goals")
      .delete()
      .eq("id", goalId);

    if (error) {
      toast.error("Failed to delete goal");
    } else {
      toast.success("Goal deleted");
      fetchGoals();
    }
  };

  const resetForm = () => {
    setGoalType("general");
    setTitle("");
    setDescription("");
    setTargetValue("");
    setTargetUnit("");
    setTargetDate("");
  };

  const getGoalIcon = (type: string) => {
    const goal = goalTypes.find((g) => g.value === type);
    return goal ? goal.icon : Target;
  };

  const getGoalColor = (type: string) => {
    const goal = goalTypes.find((g) => g.value === type);
    return goal ? goal.color : "text-primary";
  };

  const activeGoals = goals.filter(g => g.status === "active");
  const completedGoals = goals.filter(g => g.status === "completed");

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Fitness Goals</h1>
          <p className="text-muted-foreground">
            Set and track your fitness objectives.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
              <DialogDescription>
                Set a fitness goal to track your progress.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="goalType">Goal Type</Label>
                <Select value={goalType} onValueChange={setGoalType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select goal type" />
                  </SelectTrigger>
                  <SelectContent>
                    {goalTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className={`h-4 w-4 ${type.color}`} />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Goal Title *</Label>
                <Input 
                  id="title" 
                  placeholder="e.g., Lose 5kg" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe your goal..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="target">Target Value</Label>
                  <Input 
                    id="target" 
                    type="number" 
                    placeholder="100" 
                    value={targetValue}
                    onChange={(e) => setTargetValue(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input 
                    id="unit" 
                    placeholder="kg, reps, min" 
                    value={targetUnit}
                    onChange={(e) => setTargetUnit(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Target Date</Label>
                <Input 
                  id="deadline" 
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateGoal} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create Goal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Goals */}
      <div className="space-y-4 mb-8">
        <h2 className="text-lg font-semibold">Active Goals ({activeGoals.length})</h2>
        {activeGoals.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No active goals</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                Set your first fitness goal to start tracking your progress.
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Goal
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {activeGoals.map((goal) => {
              const Icon = getGoalIcon(goal.goal_type);
              const progress = goal.target_value 
                ? ((goal.current_value || 0) / goal.target_value) * 100 
                : 0;
              return (
                <Card key={goal.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-muted ${getGoalColor(goal.goal_type)}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{goal.title}</CardTitle>
                          <CardDescription>{goal.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleCompleteGoal(goal.id)}
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleDeleteGoal(goal.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {goal.target_value && (
                        <>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">
                              {goal.current_value || 0} / {goal.target_value} {goal.target_unit}
                            </span>
                          </div>
                          <Progress value={Math.min(progress, 100)} className="h-2" />
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              placeholder="Update progress"
                              className="h-8 text-sm"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  const value = parseFloat((e.target as HTMLInputElement).value);
                                  if (!isNaN(value)) {
                                    handleUpdateProgress(goal.id, value);
                                    (e.target as HTMLInputElement).value = "";
                                  }
                                }
                              }}
                            />
                            <span className="text-xs text-muted-foreground">Press Enter</span>
                          </div>
                        </>
                      )}
                      {goal.target_date && (
                        <div className="text-sm text-muted-foreground">
                          Target: {new Date(goal.target_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Completed Goals ({completedGoals.length})</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {completedGoals.map((goal) => {
              const Icon = getGoalIcon(goal.goal_type);
              return (
                <Card key={goal.id} className="opacity-75">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-muted ${getGoalColor(goal.goal_type)}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{goal.title}</CardTitle>
                          <CardDescription>{goal.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Completed
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Goal Types Overview */}
      <div className="space-y-4 mt-8">
        <h2 className="text-lg font-semibold">Goal Categories</h2>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {goalTypes.map((type) => (
            <Card
              key={type.value}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => {
                setGoalType(type.value);
                setDialogOpen(true);
              }}
            >
              <CardContent className="flex flex-col items-center justify-center p-4">
                <div className={`p-3 rounded-full bg-muted mb-2 ${type.color}`}>
                  <type.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-center">{type.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
