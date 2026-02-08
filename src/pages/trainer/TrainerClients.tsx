import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { 
  Users, 
  Plus, 
  Mail, 
  UserPlus, 
  Activity, 
  Target, 
  Dumbbell,
  Calendar,
  TrendingUp,
  Loader2,
  Eye,
  Edit,
  Trash2
} from "lucide-react";

interface Client {
  id: string;
  client_id: string;
  status: string;
  access_level: string;
  started_at: string;
  notes: string | null;
  profile: {
    full_name: string | null;
    email: string;
    avatar_url: string | null;
  } | null;
  fitness_record: {
    fitness_level: string | null;
    current_weight_kg: number | null;
  } | null;
  active_programs: number;
}

interface ClientDetails {
  profile: {
    full_name: string | null;
    email: string;
    phone: string | null;
    date_of_birth: string | null;
  };
  fitness_record: {
    height_cm: number | null;
    current_weight_kg: number | null;
    body_fat_percentage: number | null;
    fitness_level: string | null;
    current_injuries: string[] | null;
    pain_areas: string[] | null;
    doctor_restrictions: string | null;
  } | null;
  goals: Array<{
    id: string;
    title: string;
    goal_type: string;
    status: string;
    target_value: number | null;
    current_value: number | null;
  }>;
  programs: Array<{
    id: string;
    name: string;
    status: string;
    duration_weeks: number;
    start_date: string | null;
  }>;
}

export default function TrainerClients() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [clientDetails, setClientDetails] = useState<ClientDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    if (user) {
      fetchClients();
    }
  }, [user]);

  const fetchClients = async () => {
    if (!user) return;
    setLoading(true);

    // Get trainer's clients
    const { data: clientRelations, error } = await supabase
      .from("trainer_clients")
      .select("*")
      .eq("trainer_id", user.id)
      .order("started_at", { ascending: false });

    if (error) {
      console.error("Error fetching clients:", error);
      setLoading(false);
      return;
    }

    // Fetch profile and fitness data for each client
    const enrichedClients: Client[] = [];
    
    for (const relation of clientRelations || []) {
      // Fetch profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, email, avatar_url")
        .eq("user_id", relation.client_id)
        .maybeSingle();

      // Fetch fitness record
      const { data: fitnessRecord } = await supabase
        .from("fitness_records")
        .select("fitness_level, current_weight_kg")
        .eq("user_id", relation.client_id)
        .maybeSingle();

      // Count active programs
      const { count } = await supabase
        .from("workout_programs")
        .select("id", { count: "exact", head: true })
        .eq("client_id", relation.client_id)
        .eq("trainer_id", user.id)
        .eq("status", "active");

      enrichedClients.push({
        id: relation.id,
        client_id: relation.client_id,
        status: relation.status,
        access_level: relation.access_level,
        started_at: relation.started_at,
        notes: relation.notes,
        profile: profile,
        fitness_record: fitnessRecord,
        active_programs: count || 0,
      });
    }

    setClients(enrichedClients);
    setLoading(false);
  };

  const handleInviteClient = async () => {
    if (!user || !inviteEmail) return;

    setInviting(true);

    // Check if user exists
    const { data: existingProfile, error: profileError } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("email", inviteEmail.toLowerCase())
      .maybeSingle();

    if (!existingProfile) {
      toast.error("User not found. They need to sign up first.");
      setInviting(false);
      return;
    }

    // Check if already a client
    const { data: existingClient } = await supabase
      .from("trainer_clients")
      .select("id")
      .eq("trainer_id", user.id)
      .eq("client_id", existingProfile.user_id)
      .maybeSingle();

    if (existingClient) {
      toast.error("This user is already your client.");
      setInviting(false);
      return;
    }

    // Add as client
    const { error: insertError } = await supabase
      .from("trainer_clients")
      .insert({
        trainer_id: user.id,
        client_id: existingProfile.user_id,
        status: "active",
        access_level: "view",
      });

    if (insertError) {
      console.error("Error adding client:", insertError);
      toast.error("Failed to add client");
    } else {
      // Add timeline event for client
      await supabase.from("timeline_events").insert({
        user_id: existingProfile.user_id,
        event_type: "trainer_joined",
        title: "New Trainer Added",
        description: "A trainer has been assigned to help with your fitness journey",
        event_date: new Date().toISOString().split("T")[0],
      });

      toast.success("Client added successfully!");
      setInviteDialogOpen(false);
      setInviteEmail("");
      fetchClients();
    }

    setInviting(false);
  };

  const fetchClientDetails = async (clientId: string) => {
    if (!user) return;
    setLoadingDetails(true);
    setSelectedClient(clientId);

    // Fetch profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email, phone, date_of_birth")
      .eq("user_id", clientId)
      .maybeSingle();

    // Fetch fitness record
    const { data: fitnessRecord } = await supabase
      .from("fitness_records")
      .select("height_cm, current_weight_kg, body_fat_percentage, fitness_level, current_injuries, pain_areas, doctor_restrictions")
      .eq("user_id", clientId)
      .maybeSingle();

    // Fetch goals
    const { data: goals } = await supabase
      .from("fitness_goals")
      .select("id, title, goal_type, status, target_value, current_value")
      .eq("user_id", clientId)
      .order("created_at", { ascending: false });

    // Fetch programs
    const { data: programs } = await supabase
      .from("workout_programs")
      .select("id, name, status, duration_weeks, start_date")
      .eq("client_id", clientId)
      .eq("trainer_id", user.id)
      .order("created_at", { ascending: false });

    setClientDetails({
      profile: profile || { full_name: null, email: "", phone: null, date_of_birth: null },
      fitness_record: fitnessRecord,
      goals: goals || [],
      programs: programs || [],
    });

    setLoadingDetails(false);
  };

  const removeClient = async (relationId: string) => {
    const { error } = await supabase
      .from("trainer_clients")
      .update({ status: "ended", ended_at: new Date().toISOString() })
      .eq("id", relationId);

    if (error) {
      toast.error("Failed to remove client");
    } else {
      toast.success("Client removed");
      fetchClients();
      setSelectedClient(null);
    }
  };

  const activeClients = clients.filter(c => c.status === "active");

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
          <h1 className="text-3xl font-bold mb-2">My Clients</h1>
          <p className="text-muted-foreground">
            Manage your clients and their fitness programs.
          </p>
        </div>
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>
                Enter the email of an existing user to add them as your client.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Client Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="client@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  The user must have an account on the platform.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleInviteClient} disabled={inviting || !inviteEmail}>
                {inviting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Add Client
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Client List */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Active Clients ({activeClients.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {activeClients.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-muted mx-auto flex items-center justify-center mb-3">
                    <Users className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">No clients yet</p>
                  <Button size="sm" onClick={() => setInviteDialogOpen(true)}>
                    <Plus className="h-3 w-3 mr-1" />
                    Add First Client
                  </Button>
                </div>
              ) : (
                activeClients.map((client) => (
                  <div
                    key={client.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedClient === client.client_id 
                        ? "border-primary bg-primary/5" 
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => fetchClientDetails(client.client_id)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {(client.profile?.full_name || client.profile?.email || "?")[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {client.profile?.full_name || client.profile?.email || "Unknown"}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="capitalize">{client.fitness_record?.fitness_level || "Beginner"}</span>
                          <span>•</span>
                          <span>{client.active_programs} programs</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Client Details */}
        <div className="lg:col-span-2">
          {!selectedClient ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Eye className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Select a Client</h3>
                <p className="text-muted-foreground text-center max-w-sm">
                  Click on a client from the list to view their profile, fitness records, and programs.
                </p>
              </CardContent>
            </Card>
          ) : loadingDetails ? (
            <Card>
              <CardContent className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </CardContent>
            </Card>
          ) : clientDetails ? (
            <Tabs defaultValue="profile" className="space-y-4">
              <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="fitness">Fitness Record</TabsTrigger>
                <TabsTrigger value="goals">Goals</TabsTrigger>
                <TabsTrigger value="programs">Programs</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      Client Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium">{clientDetails.profile.full_name || "Not set"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{clientDetails.profile.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{clientDetails.profile.phone || "Not set"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date of Birth</p>
                        <p className="font-medium">
                          {clientDetails.profile.date_of_birth 
                            ? new Date(clientDetails.profile.date_of_birth).toLocaleDateString()
                            : "Not set"}
                        </p>
                      </div>
                    </div>
                    <div className="pt-4 flex gap-2">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => {
                          const client = clients.find(c => c.client_id === selectedClient);
                          if (client) removeClient(client.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove Client
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="fitness">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Fitness Record
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {clientDetails.fitness_record ? (
                      <>
                        <div className="grid gap-4 sm:grid-cols-3">
                          <div className="p-3 rounded-lg bg-muted">
                            <p className="text-sm text-muted-foreground">Height</p>
                            <p className="text-xl font-bold">
                              {clientDetails.fitness_record.height_cm || "--"} cm
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-muted">
                            <p className="text-sm text-muted-foreground">Weight</p>
                            <p className="text-xl font-bold">
                              {clientDetails.fitness_record.current_weight_kg || "--"} kg
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-muted">
                            <p className="text-sm text-muted-foreground">Body Fat</p>
                            <p className="text-xl font-bold">
                              {clientDetails.fitness_record.body_fat_percentage || "--"}%
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Fitness Level</p>
                          <Badge variant="secondary" className="capitalize">
                            {clientDetails.fitness_record.fitness_level || "Beginner"}
                          </Badge>
                        </div>
                        {(clientDetails.fitness_record.current_injuries?.length || 
                          clientDetails.fitness_record.pain_areas?.length) && (
                          <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                            <p className="font-medium text-yellow-800 mb-2">⚠️ Health Notes</p>
                            {clientDetails.fitness_record.current_injuries?.length > 0 && (
                              <p className="text-sm text-yellow-700">
                                <strong>Injuries:</strong> {clientDetails.fitness_record.current_injuries.join(", ")}
                              </p>
                            )}
                            {clientDetails.fitness_record.pain_areas?.length > 0 && (
                              <p className="text-sm text-yellow-700">
                                <strong>Pain Areas:</strong> {clientDetails.fitness_record.pain_areas.join(", ")}
                              </p>
                            )}
                            {clientDetails.fitness_record.doctor_restrictions && (
                              <p className="text-sm text-yellow-700">
                                <strong>Restrictions:</strong> {clientDetails.fitness_record.doctor_restrictions}
                              </p>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        Client hasn't completed their fitness profile yet.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="goals">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Fitness Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {clientDetails.goals.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        Client hasn't set any goals yet.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {clientDetails.goals.map((goal) => (
                          <div key={goal.id} className="flex items-center justify-between p-3 rounded-lg border">
                            <div>
                              <p className="font-medium">{goal.title}</p>
                              <p className="text-sm text-muted-foreground capitalize">{goal.goal_type.replace("_", " ")}</p>
                            </div>
                            <Badge variant={goal.status === "active" ? "default" : "secondary"}>
                              {goal.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="programs">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Dumbbell className="h-5 w-5 text-primary" />
                      Training Programs
                    </CardTitle>
                    <Button size="sm" asChild>
                      <a href="/trainer/programs">
                        <Plus className="h-4 w-4 mr-1" />
                        Create Program
                      </a>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {clientDetails.programs.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        No programs assigned yet.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {clientDetails.programs.map((program) => (
                          <div key={program.id} className="flex items-center justify-between p-3 rounded-lg border">
                            <div>
                              <p className="font-medium">{program.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {program.duration_weeks} weeks
                                {program.start_date && ` • Started ${new Date(program.start_date).toLocaleDateString()}`}
                              </p>
                            </div>
                            <Badge variant={program.status === "active" ? "default" : "secondary"}>
                              {program.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : null}
        </div>
      </div>
    </DashboardLayout>
  );
}
