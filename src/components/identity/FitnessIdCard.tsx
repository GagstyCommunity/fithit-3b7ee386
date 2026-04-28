import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { Flame, Repeat, Share2, Sparkles, Copy } from "lucide-react";
import { Link } from "react-router-dom";

export function FitnessIdCard() {
  const { user } = useAuth();
  const [fitnessId, setFitnessId] = useState<string>("FH-——————");
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const [{ data: profile }, { data: scoreData }, { data: streakData }] = await Promise.all([
        supabase.from("profiles").select("fitness_id").eq("user_id", user.id).maybeSingle(),
        supabase.rpc("get_fitness_score", { _user_id: user.id }),
        supabase.rpc("get_user_streak", { _user_id: user.id }),
      ]);
      if (cancelled) return;
      if (profile?.fitness_id) setFitnessId(profile.fitness_id);
      if (typeof scoreData === "number") setScore(scoreData);
      if (typeof streakData === "number") setStreak(streakData);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user]);

  const tier = score >= 800 ? "Elite" : score >= 600 ? "Athlete" : score >= 400 ? "Active" : score >= 200 ? "Building" : "Starter";
  const pct = Math.min(100, Math.round((score / 1000) * 100));

  const copyId = () => {
    navigator.clipboard.writeText(fitnessId);
    toast({ title: "Fitness ID copied", description: fitnessId });
  };

  const shareScore = async () => {
    const text = `My Fitness ID: ${fitnessId}\nFitness Score: ${score}/1000 · ${streak}🔥 day streak\nMy fitness moves with me — fithit.lovable.app`;
    if (navigator.share) {
      try { await navigator.share({ text }); } catch { /* user cancelled */ }
    } else {
      navigator.clipboard.writeText(text);
      toast({ title: "Score copied to clipboard" });
    }
  };

  return (
    <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card">
      <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="relative p-6 md:p-7">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Fitness ID</p>
            <button
              onClick={copyId}
              className="group inline-flex items-center gap-2 font-mono text-2xl md:text-3xl font-bold tracking-tight hover:text-primary transition-colors"
              title="Copy your Fitness ID"
            >
              {fitnessId}
              <Copy className="w-4 h-4 opacity-0 group-hover:opacity-60 transition-opacity" />
            </button>
            <p className="text-xs text-muted-foreground mt-1">Your portable identity. Works at any gym, with any trainer.</p>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
            <Sparkles className="w-3 h-3" /> {tier}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-4xl md:text-5xl font-bold text-primary">{loading ? "—" : score}</span>
              <span className="text-sm text-muted-foreground">/ 1000</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">Fitness Score</p>
            <Progress value={pct} className="h-1.5" />
          </div>
          <div className="flex flex-col items-end justify-end text-right">
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-500" />
              <span className="text-4xl md:text-5xl font-bold">{loading ? "—" : streak}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{streak === 1 ? "day" : "days"} streak</p>
            {streak > 0 && streak < 3 && (
              <p className="text-xs text-orange-500 font-medium mt-1">Don't break it!</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1 min-w-[140px]">
            <Link to="/dashboard/invitations">
              <Repeat className="w-4 h-4 mr-2" />
              Switch Gym (Keep Progress)
            </Link>
          </Button>
          <Button onClick={shareScore} variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </Card>
  );
}
