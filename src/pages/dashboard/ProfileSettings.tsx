import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { User, Bell, Settings, Shield, Save, Loader2 } from "lucide-react";

interface NotificationPreferences {
  workout_reminder: boolean;
  reminder_minutes: number;
}

export default function ProfileSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [preferredWorkoutTime, setPreferredWorkoutTime] = useState("morning");
  const [timezone, setTimezone] = useState("UTC");
  
  // Notification preferences
  const [workoutReminder, setWorkoutReminder] = useState(true);
  const [reminderMinutes, setReminderMinutes] = useState(60);
  
  // Privacy
  const [preferredUnits, setPreferredUnits] = useState("metric");
  const [medicalNotesPrivate, setMedicalNotesPrivate] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    if (!user) return;

    setLoading(true);
    
    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
    } else if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
      setDateOfBirth(profile.date_of_birth || "");
      setPreferredWorkoutTime(profile.preferred_workout_time || "morning");
      setTimezone(profile.timezone || "UTC");
      
      if (profile.notification_preferences && typeof profile.notification_preferences === 'object') {
        const notifPrefs = profile.notification_preferences as Record<string, unknown>;
        if ('workout_reminder' in notifPrefs) {
          setWorkoutReminder(Boolean(notifPrefs.workout_reminder ?? true));
          setReminderMinutes(Number(notifPrefs.reminder_minutes ?? 60));
        }
      }
    }

    // Fetch fitness record
    const { data: fitnessRecord, error: fitnessError } = await supabase
      .from("fitness_records")
      .select("preferred_units, medical_notes_private")
      .eq("user_id", user.id)
      .maybeSingle();

    if (fitnessError) {
      console.error("Error fetching fitness record:", fitnessError);
    } else if (fitnessRecord) {
      setPreferredUnits(fitnessRecord.preferred_units || "metric");
      setMedicalNotesPrivate(fitnessRecord.medical_notes_private ?? true);
    }

    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);

    // Update profile
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName || null,
        phone: phone || null,
        date_of_birth: dateOfBirth || null,
        preferred_workout_time: preferredWorkoutTime,
        timezone: timezone,
        notification_preferences: {
          workout_reminder: workoutReminder,
          reminder_minutes: reminderMinutes,
        },
      })
      .eq("user_id", user.id);

    if (profileError) {
      console.error("Error updating profile:", profileError);
      toast.error("Failed to update profile");
      setSaving(false);
      return;
    }

    // Update fitness record
    const { error: fitnessError } = await supabase
      .from("fitness_records")
      .update({
        preferred_units: preferredUnits,
        medical_notes_private: medicalNotesPrivate,
      })
      .eq("user_id", user.id);

    if (fitnessError) {
      console.error("Error updating fitness record:", fitnessError);
      toast.error("Failed to update preferences");
    } else {
      toast.success("Profile updated successfully!");
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

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your personal information and preferences.
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Your basic profile information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="" />
                <AvatarFallback className="text-lg bg-primary/10 text-primary">
                  {fullName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{fullName || "Your Name"}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workout Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Workout Preferences
            </CardTitle>
            <CardDescription>
              Customize your workout experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Preferred Workout Time</Label>
              <RadioGroup
                value={preferredWorkoutTime}
                onValueChange={setPreferredWorkoutTime}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="morning" id="morning" />
                  <Label htmlFor="morning" className="font-normal">Morning</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="afternoon" id="afternoon" />
                  <Label htmlFor="afternoon" className="font-normal">Afternoon</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="evening" id="evening" />
                  <Label htmlFor="evening" className="font-normal">Evening</Label>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Preferred Units</Label>
              <RadioGroup
                value={preferredUnits}
                onValueChange={setPreferredUnits}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="metric" id="metric" />
                  <Label htmlFor="metric" className="font-normal">Metric (kg, cm)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="imperial" id="imperial" />
                  <Label htmlFor="imperial" className="font-normal">Imperial (lbs, ft)</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure your notification preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Workout Reminders</p>
                <p className="text-sm text-muted-foreground">
                  Get reminded before your scheduled workout
                </p>
              </div>
              <Switch
                checked={workoutReminder}
                onCheckedChange={setWorkoutReminder}
              />
            </div>

            {workoutReminder && (
              <div className="space-y-2 pl-4 border-l-2 border-muted">
                <Label>Reminder Time</Label>
                <RadioGroup
                  value={reminderMinutes.toString()}
                  onValueChange={(v) => setReminderMinutes(parseInt(v))}
                  className="flex flex-wrap gap-4"
                >
                  {[15, 30, 60, 120].map((mins) => (
                    <div key={mins} className="flex items-center space-x-2">
                      <RadioGroupItem value={mins.toString()} id={`mins-${mins}`} />
                      <Label htmlFor={`mins-${mins}`} className="font-normal">
                        {mins < 60 ? `${mins} min` : `${mins / 60} hr`} before
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Privacy
            </CardTitle>
            <CardDescription>
              Control who can see your information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Keep Medical Notes Private</p>
                <p className="text-sm text-muted-foreground">
                  Hide injury and medical information from trainers by default
                </p>
              </div>
              <Switch
                checked={medicalNotesPrivate}
                onCheckedChange={setMedicalNotesPrivate}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>
    </DashboardLayout>
  );
}
