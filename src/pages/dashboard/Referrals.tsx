import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth, AppRole } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Copy, Share2, Wallet, Users, TrendingUp, MessageCircle } from "lucide-react";

interface Wallet {
  balance: number;
  lifetime_earnings: number;
  currency: string;
}

interface ReferralRow {
  id: string;
  referred_user_id: string;
  status: string;
  created_at: string;
  commission_percent: number;
}

function commissionForRole(roles: AppRole[]) {
  if (roles.includes("gym_admin")) return { pct: 10, label: "₹10 per active user/month", role: "Gym" };
  if (roles.includes("trainer")) return { pct: 5, label: "5% per active client", role: "Trainer" };
  return { pct: 2.5, label: "2.5% recurring per referred user", role: "User" };
}

export default function Referrals() {
  const { user, roles } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [referrals, setReferrals] = useState<ReferralRow[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  const [thisMonthEarnings, setThisMonthEarnings] = useState(0);

  const referralCode = user?.id?.slice(0, 8).toUpperCase() ?? "";
  const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;
  const commission = commissionForRole(roles);

  const waMessage =
    `Hey! I'm using Fitness OS — your fitness data stays *yours* even if you switch gyms or trainers. ` +
    `Sign up free using my link and we both get rewards 💪\n${referralLink}`;

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: w }, { data: refs }, { data: earnings }] = await Promise.all([
        supabase.from("wallets").select("balance, lifetime_earnings, currency").eq("user_id", user.id).maybeSingle(),
        supabase.from("referrals").select("*").eq("referrer_id", user.id),
        supabase
          .from("referral_earnings")
          .select("amount, period_start")
          .eq("user_id", user.id)
          .gte("period_start", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
      ]);
      setWallet(w as Wallet | null);
      setReferrals((refs as ReferralRow[]) || []);
      setActiveCount(((refs as ReferralRow[]) || []).filter((r) => r.status === "active").length);
      setThisMonthEarnings(((earnings as { amount: number }[]) || []).reduce((s, e) => s + Number(e.amount), 0));
    })();
  }, [user]);

  const copy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  const shareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(waMessage)}`;
    window.open(url, "_blank");
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Refer & Earn</h1>
        <p className="text-muted-foreground">
          You're earning as a <span className="font-medium text-foreground">{commission.role}</span> — {commission.label}
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Wallet className="h-4 w-4" /> Wallet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{wallet?.balance?.toFixed(0) ?? 0}</div>
            <p className="text-xs text-muted-foreground">Available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{thisMonthEarnings.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">Earnings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" /> Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
            <p className="text-xs text-muted-foreground">Active referrals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Lifetime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{wallet?.lifetime_earnings?.toFixed(0) ?? 0}</div>
            <p className="text-xs text-muted-foreground">Total earned</p>
          </CardContent>
        </Card>
      </div>

      {/* Referral link */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
          <CardDescription>Share this anywhere — every signup is tracked back to you.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input value={referralLink} readOnly className="font-mono text-sm" />
            <Button onClick={() => copy(referralLink, "Link")} variant="outline">
              <Copy className="h-4 w-4 mr-2" /> Copy
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={shareWhatsApp} className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white">
              <MessageCircle className="h-4 w-4 mr-2" /> Share on WhatsApp
            </Button>
            <Button onClick={() => copy(waMessage, "Message")} variant="outline" className="flex-1">
              <Share2 className="h-4 w-4 mr-2" /> Copy invite message
            </Button>
          </div>

          <div className="rounded-lg bg-muted p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">WhatsApp message preview</p>
            <p className="text-sm whitespace-pre-wrap">{waMessage}</p>
          </div>
        </CardContent>
      </Card>

      {/* Referral list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No referrals yet. Share your link to start earning.
            </div>
          ) : (
            <div className="space-y-2">
              {referrals.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="text-sm font-medium">User {r.referred_user_id.slice(0, 8)}</p>
                    <p className="text-xs text-muted-foreground">
                      Joined {new Date(r.created_at).toLocaleDateString()} · {r.commission_percent}% commission
                    </p>
                  </div>
                  <Badge variant={r.status === "active" ? "default" : "secondary"}>{r.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
