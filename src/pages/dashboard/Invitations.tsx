import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth, AppRole } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, Send, Inbox, Check, X } from "lucide-react";

type InviteType =
  | "user_to_trainer" | "user_to_gym"
  | "trainer_to_user" | "trainer_to_gym"
  | "gym_to_user" | "gym_to_trainer";

interface Invitation {
  id: string;
  invite_code: string;
  sender_id: string;
  recipient_email: string | null;
  recipient_id: string | null;
  invite_type: InviteType;
  message: string | null;
  status: string;
  created_at: string;
  expires_at: string;
}

function inviteOptionsForRole(roles: AppRole[]): { value: InviteType; label: string }[] {
  const opts: { value: InviteType; label: string }[] = [];
  if (roles.includes("user")) {
    opts.push({ value: "user_to_trainer", label: "Invite a Trainer" });
    opts.push({ value: "user_to_gym", label: "Invite a Gym" });
  }
  if (roles.includes("trainer")) {
    opts.push({ value: "trainer_to_user", label: "Invite a Client" });
    opts.push({ value: "trainer_to_gym", label: "Invite a Gym" });
  }
  if (roles.includes("gym_admin")) {
    opts.push({ value: "gym_to_user", label: "Invite a Member" });
    opts.push({ value: "gym_to_trainer", label: "Invite a Trainer" });
  }
  return opts;
}

function senderRoleFromType(t: InviteType): "user" | "trainer" | "gym_admin" {
  if (t.startsWith("user_")) return "user";
  if (t.startsWith("trainer_")) return "trainer";
  return "gym_admin";
}

export default function Invitations() {
  const { user, roles } = useAuth();
  const [sent, setSent] = useState<Invitation[]>([]);
  const [received, setReceived] = useState<Invitation[]>([]);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<InviteType | "">("");
  const [sending, setSending] = useState(false);

  const options = inviteOptionsForRole(roles);

  const load = async () => {
    if (!user) return;
    const [{ data: s }, { data: r }] = await Promise.all([
      supabase.from("invitations").select("*").eq("sender_id", user.id).order("created_at", { ascending: false }),
      supabase.from("invitations").select("*").eq("recipient_id", user.id).order("created_at", { ascending: false }),
    ]);
    setSent((s as Invitation[]) || []);
    setReceived((r as Invitation[]) || []);
  };

  useEffect(() => {
    load();
  }, [user]);

  const sendInvite = async () => {
    if (!user || !type || !email) {
      toast.error("Pick an invite type and enter an email");
      return;
    }
    setSending(true);
    const { error } = await supabase.from("invitations").insert({
      sender_id: user.id,
      sender_role: senderRoleFromType(type),
      recipient_email: email.toLowerCase().trim(),
      invite_type: type,
      message: message || null,
    });
    setSending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Invitation sent!");
    setEmail("");
    setMessage("");
    load();
  };

  const respond = async (id: string, status: "accepted" | "declined") => {
    const { error } = await supabase
      .from("invitations")
      .update({ status, responded_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`Invitation ${status}`);
    load();
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Invitations</h1>
        <p className="text-muted-foreground">
          Connect with trainers, gyms, and clients. You control who has access to your data.
        </p>
      </div>

      <Tabs defaultValue="send" className="space-y-6">
        <TabsList>
          <TabsTrigger value="send"><Send className="h-4 w-4 mr-2" />Send</TabsTrigger>
          <TabsTrigger value="received"><Inbox className="h-4 w-4 mr-2" />Received ({received.filter(r => r.status === "pending").length})</TabsTrigger>
          <TabsTrigger value="sent"><Mail className="h-4 w-4 mr-2" />Sent ({sent.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="send">
          <Card>
            <CardHeader>
              <CardTitle>Send a new invitation</CardTitle>
              <CardDescription>
                Recipients accept or decline. They never get access to your data automatically.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Invite type</label>
                <Select value={type} onValueChange={(v) => setType(v as InviteType)}>
                  <SelectTrigger><SelectValue placeholder="Choose..." /></SelectTrigger>
                  <SelectContent>
                    {options.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Recipient email</label>
                <Input type="email" placeholder="them@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Personal message (optional)</label>
                <Textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Hey, would love to train together..." />
              </div>
              <Button onClick={sendInvite} disabled={sending || !type || !email} className="w-full sm:w-auto">
                <Send className="h-4 w-4 mr-2" />
                {sending ? "Sending..." : "Send invitation"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="received">
          <Card>
            <CardHeader><CardTitle>Invitations to you</CardTitle></CardHeader>
            <CardContent>
              {received.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">No invitations received.</p>
              ) : (
                <div className="space-y-3">
                  {received.map((inv) => (
                    <div key={inv.id} className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-sm">{inv.invite_type.replace(/_/g, " → ")}</p>
                        <Badge variant={inv.status === "pending" ? "secondary" : "default"}>{inv.status}</Badge>
                      </div>
                      {inv.message && <p className="text-sm text-muted-foreground mb-3">"{inv.message}"</p>}
                      {inv.status === "pending" && (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => respond(inv.id, "accepted")}>
                            <Check className="h-4 w-4 mr-1" /> Accept
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => respond(inv.id, "declined")}>
                            <X className="h-4 w-4 mr-1" /> Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sent">
          <Card>
            <CardHeader><CardTitle>Invitations you sent</CardTitle></CardHeader>
            <CardContent>
              {sent.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">No invitations sent yet.</p>
              ) : (
                <div className="space-y-2">
                  {sent.map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="text-sm font-medium">{inv.recipient_email}</p>
                        <p className="text-xs text-muted-foreground">
                          {inv.invite_type.replace(/_/g, " → ")} · {new Date(inv.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={
                        inv.status === "accepted" ? "default" :
                        inv.status === "declined" ? "destructive" : "secondary"
                      }>
                        {inv.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
