import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { 
  User, 
  Activity, 
  Target, 
  Shield, 
  ChevronRight, 
  ChevronLeft,
  Dumbbell,
  Check
} from "lucide-react";

const STEPS = [
  { id: 1, title: "Basic Info", icon: User },
  { id: 2, title: "Body Stats", icon: Activity },
  { id: 3, title: "Fitness Goals", icon: Target },
  { id: 4, title: "Medical Info", icon: Shield },
];

const FITNESS_LEVELS = [
  { value: "beginner", label: "Beginner", description: "New to fitness or returning after a long break" },
  { value: "intermediate", label: "Intermediate", description: "Regular gym-goer with 1-3 years experience" },
  { value: "advanced", label: "Advanced", description: "3+ years of consistent training" },
  { value: "athlete", label: "Athlete", description: "Competitive or professional athlete" },
];

const GOAL_TYPES = [
  { value: "fat_loss", label: "Fat Loss", description: "Reduce body fat and improve definition" },
  { value: "muscle_gain", label: "Muscle Gain", description: "Build muscle mass and strength" },
  { value: "strength", label: "Strength", description: "Increase lifting numbers and power" },
  { value: "endurance", label: "Endurance", description: "Improve cardio and stamina" },
  { value: "rehab", label: "Rehab", description: "Recover from injury or medical condition" },
  { value: "general", label: "General Fitness", description: "Overall health and wellness" },
];

const PAIN_AREAS = [
  "Lower Back", "Upper Back", "Neck", "Shoulders", 
  "Elbows", "Wrists", "Hips", "Knees", "Ankles"
];

export function OnboardingWizard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    // Basic Info
    fullName: "",
    phone: "",
    dateOfBirth: "",
    preferredWorkoutTime: "morning",
    
    // Body Stats
    heightCm: "",
    currentWeightKg: "",
    bodyFatPercentage: "",
    fitnessLevel: "beginner",
    
    // Goals
    primaryGoal: "general",
    targetWeightKg: "",
    goalNotes: "",
    
    // Medical
    currentInjuries: [] as string[],
    pastInjuries: [] as string[],
    painAreas: [] as string[],
    foodAllergies: "",
    supplementAllergies: "",
    doctorRestrictions: "",
  });

  const updateField = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: string, item: string) => {
    setFormData(prev => {
      const arr = prev[field as keyof typeof prev] as string[];
      if (arr.includes(item)) {
        return { ...prev, [field]: arr.filter(i => i !== item) };
      }
      return { ...prev, [field]: [...arr, item] };
    });
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: formData.fullName || null,
          phone: formData.phone || null,
          date_of_birth: formData.dateOfBirth || null,
          preferred_workout_time: formData.preferredWorkoutTime,
        })
        .eq("user_id", user.id);

      if (profileError) throw profileError;

      // Update fitness record
      const { error: fitnessError } = await supabase
        .from("fitness_records")
        .update({
          height_cm: formData.heightCm ? parseFloat(formData.heightCm) : null,
          current_weight_kg: formData.currentWeightKg ? parseFloat(formData.currentWeightKg) : null,
          body_fat_percentage: formData.bodyFatPercentage ? parseFloat(formData.bodyFatPercentage) : null,
          fitness_level: formData.fitnessLevel as "beginner" | "intermediate" | "advanced" | "athlete",
          current_injuries: formData.currentInjuries.length > 0 ? formData.currentInjuries : null,
          past_injuries: formData.pastInjuries.length > 0 ? formData.pastInjuries : null,
          pain_areas: formData.painAreas.length > 0 ? formData.painAreas : null,
          food_allergies: formData.foodAllergies ? formData.foodAllergies.split(",").map(s => s.trim()) : null,
          supplement_allergies: formData.supplementAllergies ? formData.supplementAllergies.split(",").map(s => s.trim()) : null,
          doctor_restrictions: formData.doctorRestrictions || null,
        })
        .eq("user_id", user.id);

      if (fitnessError) throw fitnessError;

      // Create primary fitness goal
      if (formData.primaryGoal) {
        const { error: goalError } = await supabase
          .from("fitness_goals")
          .insert({
            user_id: user.id,
            goal_type: formData.primaryGoal,
            title: GOAL_TYPES.find(g => g.value === formData.primaryGoal)?.label || "Fitness Goal",
            description: formData.goalNotes || null,
            target_value: formData.targetWeightKg ? parseFloat(formData.targetWeightKg) : null,
            target_unit: formData.targetWeightKg ? "kg" : null,
            current_value: formData.currentWeightKg ? parseFloat(formData.currentWeightKg) : null,
          });

        if (goalError) console.error("Goal creation error:", goalError);
      }

      // Add timeline event for profile completion
      await supabase.from("timeline_events").insert({
        user_id: user.id,
        event_type: "achievement",
        title: "Profile Completed",
        description: "Started your fitness journey with Fitness OS",
        event_date: new Date().toISOString().split("T")[0],
      });

      // Add initial weight to history
      if (formData.currentWeightKg) {
        await supabase.from("weight_history").insert({
          user_id: user.id,
          weight_kg: parseFloat(formData.currentWeightKg),
          notes: "Initial weight from onboarding",
        });
      }

      toast.success("Profile setup complete!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Onboarding error:", error);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const progress = (currentStep / 4) * 100;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-xl">Fitness OS</span>
          </div>
          <CardTitle>Let's Set Up Your Profile</CardTitle>
          <CardDescription>
            Step {currentStep} of 4: {STEPS[currentStep - 1].title}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress bar */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between">
              {STEPS.map((step) => {
                const Icon = step.icon;
                const isActive = step.id === currentStep;
                const isComplete = step.id < currentStep;
                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-1.5 text-xs ${
                      isActive ? "text-primary font-medium" : 
                      isComplete ? "text-muted-foreground" : "text-muted-foreground/50"
                    }`}
                  >
                    {isComplete ? (
                      <Check className="h-3.5 w-3.5 text-primary" />
                    ) : (
                      <Icon className="h-3.5 w-3.5" />
                    )}
                    <span className="hidden sm:inline">{step.title}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth (optional)</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => updateField("dateOfBirth", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Preferred Workout Time</Label>
                  <RadioGroup
                    value={formData.preferredWorkoutTime}
                    onValueChange={(v) => updateField("preferredWorkoutTime", v)}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="morning" id="morning" />
                      <Label htmlFor="morning" className="font-normal">Morning</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="evening" id="evening" />
                      <Label htmlFor="evening" className="font-normal">Evening</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Body Stats */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="175"
                    value={formData.heightCm}
                    onChange={(e) => updateField("heightCm", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Current Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="75"
                    value={formData.currentWeightKg}
                    onChange={(e) => updateField("currentWeightKg", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bodyfat">Body Fat % (optional)</Label>
                  <Input
                    id="bodyfat"
                    type="number"
                    placeholder="15"
                    value={formData.bodyFatPercentage}
                    onChange={(e) => updateField("bodyFatPercentage", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <Label>Fitness Level</Label>
                <RadioGroup
                  value={formData.fitnessLevel}
                  onValueChange={(v) => updateField("fitnessLevel", v)}
                  className="grid gap-3"
                >
                  {FITNESS_LEVELS.map((level) => (
                    <div key={level.value} className="flex items-start space-x-3">
                      <RadioGroupItem value={level.value} id={level.value} className="mt-1" />
                      <Label htmlFor={level.value} className="font-normal cursor-pointer">
                        <span className="font-medium">{level.label}</span>
                        <p className="text-sm text-muted-foreground">{level.description}</p>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          )}

          {/* Step 3: Goals */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-3">
                <Label>Primary Fitness Goal</Label>
                <RadioGroup
                  value={formData.primaryGoal}
                  onValueChange={(v) => updateField("primaryGoal", v)}
                  className="grid gap-3 sm:grid-cols-2"
                >
                  {GOAL_TYPES.map((goal) => (
                    <div 
                      key={goal.value} 
                      className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        formData.primaryGoal === goal.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      }`}
                    >
                      <RadioGroupItem value={goal.value} id={goal.value} className="mt-0.5" />
                      <Label htmlFor={goal.value} className="font-normal cursor-pointer flex-1">
                        <span className="font-medium">{goal.label}</span>
                        <p className="text-xs text-muted-foreground">{goal.description}</p>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {(formData.primaryGoal === "fat_loss" || formData.primaryGoal === "muscle_gain") && (
                <div className="space-y-2">
                  <Label htmlFor="targetWeight">Target Weight (kg)</Label>
                  <Input
                    id="targetWeight"
                    type="number"
                    placeholder="70"
                    value={formData.targetWeightKg}
                    onChange={(e) => updateField("targetWeightKg", e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="goalNotes">Additional Notes (optional)</Label>
                <Textarea
                  id="goalNotes"
                  placeholder="Any specific goals or context..."
                  value={formData.goalNotes}
                  onChange={(e) => updateField("goalNotes", e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Step 4: Medical Info */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 inline mr-1" />
                  This information is private by default and only shared with your trainer if you allow it.
                </p>
              </div>

              <div className="space-y-3">
                <Label>Pain Areas (if any)</Label>
                <div className="flex flex-wrap gap-2">
                  {PAIN_AREAS.map((area) => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => toggleArrayItem("painAreas", area)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                        formData.painAreas.includes(area)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border hover:border-primary/50"
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="foodAllergies">Food Allergies (comma separated)</Label>
                  <Input
                    id="foodAllergies"
                    placeholder="Peanuts, shellfish..."
                    value={formData.foodAllergies}
                    onChange={(e) => updateField("foodAllergies", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplementAllergies">Supplement Allergies</Label>
                  <Input
                    id="supplementAllergies"
                    placeholder="Lactose, caffeine..."
                    value={formData.supplementAllergies}
                    onChange={(e) => updateField("supplementAllergies", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="restrictions">Doctor Restrictions (optional)</Label>
                <Textarea
                  id="restrictions"
                  placeholder="Any medical restrictions or notes from your doctor..."
                  value={formData.doctorRestrictions}
                  onChange={(e) => updateField("doctorRestrictions", e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>

            {currentStep < 4 ? (
              <Button onClick={handleNext}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleComplete} disabled={loading}>
                {loading ? "Saving..." : "Complete Setup"}
                <Check className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>

          {/* Skip option */}
          <p className="text-center text-sm text-muted-foreground">
            <button 
              onClick={() => navigate("/dashboard")}
              className="hover:underline"
            >
              Skip for now
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}