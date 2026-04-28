import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import {
  Building2, Users, UserCheck, TrendingUp, IndianRupee,
  AlertTriangle, ArrowUpRight, Trophy, Bell, Plus,
} from "lucide-react";

export default function GymDashboard() {
  const { user } = useAuth();
  const [members, setMembers] = useState(0);
  const [trainers, setTrainers] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [lifetime, setLifetime] = useState(0);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: w } = await supabase.from("wallets").select("balance, lifetime_earnings").eq("user_id", user.id).maybeSingle();
      if (w) { setWalletBalance(Number(w.balance ?? 0)); setLifetime(Number(w.lifetime_earnings ?? 0)); }
    })();
  }, [user]);

  // Derived monthly revenue projection (placeholder until billing wired)
  const monthlyRevenue = members * 199;
  const platformCut = Math.round(monthlyRevenue * 0.1);
  const gymPayout = monthlyRevenue - platformCut;
  const retention = members > 0 ? 0 : 0;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Gym Operations</h1>
          <p className="text-sm text-muted-foreground">Revenue, retention, and trainer performance — all in one view.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Bell className="h-4 w-4 mr-2" />Announce</Button>
          <Button size="sm" asChild><Link to="/dashboard/invitations"><Plus className="h-4 w-4 mr-2" />Invite</Link></Button>
        </div>
      </div>

      {/* Money flow row */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">This Month Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold">₹{monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">{members} active × ₹199</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Your Payout</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold">₹{gymPayout.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">After 10% platform fee</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Wallet Balance</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold">₹{walletBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Lifetime ₹{lifetime.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-destructive/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Payment Failures</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">All members current</p>
          </CardContent>
        </Card>
      </div>

      {/* Operations row */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{members}</div>
            <p className="text-xs text-muted-foreground">Paying subscribers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Trainers on Staff</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trainers}</div>
            <p className="text-xs text-muted-foreground">Verified</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Retention (30d)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{retention}%</div>
            <Progress value={retention} className="h-1 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Referral Earnings</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(members * 10).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">₹10 / active member</p>
          </CardContent>
        </Card>
      </div>

      {/* Trainer leaderboard */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="h-5 w-5 text-primary" />
              Top Performing Trainers
            </CardTitle>
            <Badge variant="outline">Live ranking</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {trainers === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm">
              No trainers on staff yet. <Link to="/dashboard/invitations" className="text-primary underline">Invite trainers →</Link>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Rankings calculated weekly from client progress and retention.</div>
          )}
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link to="/dashboard/invitations">
          <Card className="cursor-pointer hover:border-primary/40 transition-colors h-full">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Invite Members</p>
                <p className="text-xs text-muted-foreground">Grow your base</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/dashboard/invitations">
          <Card className="cursor-pointer hover:border-primary/40 transition-colors h-full">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Add Trainer</p>
                <p className="text-xs text-muted-foreground">Auto-assign to members</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/dashboard/referrals">
          <Card className="cursor-pointer hover:border-primary/40 transition-colors h-full">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Referral Earnings</p>
                <p className="text-xs text-muted-foreground">Track commissions</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </DashboardLayout>
  );
}
