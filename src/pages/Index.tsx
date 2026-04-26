import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dumbbell,
  Shield,
  Users,
  ArrowRight,
  CheckCircle2,
  Lock,
  TrendingUp,
  MapPin,
  UserPlus,
  Activity,
  Repeat,
  Gift,
  Building2,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create Your Profile",
    description: "Add your goals, body stats, and start tracking in minutes.",
  },
  {
    icon: Users,
    title: "Invite Trainer or Join Gym",
    description: "Invite your trainer directly, or discover gyms nearby. Gyms can auto-assign trainers.",
  },
  {
    icon: Activity,
    title: "Track Everything",
    description: "Workouts, diet, cardio, progress — all in one continuous timeline.",
  },
  {
    icon: Repeat,
    title: "Switch Anytime",
    description: "Change gym or trainer — no reset, no data loss. Your journey continues.",
  },
];

const userBenefits = [
  "Never lose your progress",
  "Personal trainer guidance",
  "Home workout + gym flexibility",
  "Works even without a gym",
  "Private medical & injury notes",
  "Full access control over your data",
];

const trainerBenefits = [
  "Track all clients in one place",
  "See real progress, not guesswork",
  "Give feedback & build reputation",
  "Earn through PT + referrals",
];

const gymBenefits = [
  "Manage members + trainers",
  "Track client progress (with consent)",
  "Improve retention",
  "Evaluate trainer performance",
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
              <Dumbbell className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">Fitness OS</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link to="/login">Sign in</Link>
            </Button>
            <Button asChild className="shadow-md hover:shadow-lg transition-shadow">
              <Link to="/signup">
                Start Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="py-16 md:py-28 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
              <Shield className="w-4 h-4" />
              You own your fitness data — not your gym
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-tight">
              Your Fitness History.
              <br />
              <span className="text-primary">Owned by You.</span>
              <br />
              Not Your Gym.
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Track your workouts, diet, and progress in one place — switch gyms or
              trainers anytime <strong className="text-foreground">without losing your journey</strong>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" asChild className="text-base px-8 h-12 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
                <Link to="/signup">
                  Start Free (2 Months)
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base px-8 h-12">
                <Link to="/signup">
                  Explore Trainers Near You
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>2 months free</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                <span>You control access</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>No credit card required</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST HOOK */}
      <section className="py-16 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">
              Most fitness apps reset your journey when you change gyms.
              <br />
              <span className="text-primary">We don't.</span>
            </h2>
            <div className="grid sm:grid-cols-3 gap-4 pt-4">
              {[
                "Your data stays with you",
                "Trainers come and go — your progress stays",
                "Gyms don't own your history",
              ].map((point, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-5 flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground text-left">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <Badge variant="outline" className="mb-4">How it works</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple. Continuous. Yours.</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Four steps to a fitness journey that travels with you for life.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {steps.map((step, i) => (
              <div key={i} className="relative bg-card border border-border rounded-2xl p-6 hover:border-primary/30 hover:shadow-md transition-all">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-md">
                  {i + 1}
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOR USERS */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <Badge variant="outline" className="mb-4">For Users</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Users Love It</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Built around your goals, not your gym's contract. Train where you want, with whom you want — your record stays yours.
              </p>
              <Button asChild>
                <Link to="/signup">
                  Start Tracking Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
              {userBenefits.map((b, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOR TRAINERS */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div className="bg-card border border-border rounded-2xl p-6 space-y-3 order-2 md:order-1">
              {trainerBenefits.map((b, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{b}</span>
                </div>
              ))}
              <div className="pt-3 border-t border-border mt-4">
                <p className="text-sm font-semibold text-primary">Trainers stay free. Always.</p>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <Badge variant="outline" className="mb-4">For Trainers</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Trainers Who Actually Care</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Stop juggling spreadsheets and DMs. Manage every client in one place, see real outcomes, and grow your reputation.
              </p>
              <Button asChild>
                <Link to="/signup">
                  Join as Trainer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FOR GYMS */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <Badge variant="outline" className="mb-4">For Gyms</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Upgrade Your Gym Without the Complexity</h2>
              <p className="text-muted-foreground mb-2 leading-relaxed">
                Your members already track their progress — now you can see it (with their consent).
              </p>
              <div className="bg-card border border-border rounded-xl p-4 my-6">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl font-bold text-primary">2 Months Free</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Then ₹1,299/month — or let members pay individually.
                </p>
              </div>
              <Button asChild>
                <Link to="/signup">
                  List Your Gym
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
              {gymBenefits.map((b, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* REFERRAL */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-4">Referrals</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Earn While You Train, Track, or Coach</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
              Everyone grows. Everyone earns.
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { icon: Users, title: "Users earn 2.5%", desc: "Invite friends and earn recurring credits." },
                { icon: TrendingUp, title: "Trainers earn 5%", desc: "Earn from every active client subscription." },
                { icon: Gift, title: "Gyms earn ₹10/user", desc: "Per active member, every month." },
              ].map((r, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <r.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{r.title}</h3>
                  <p className="text-sm text-muted-foreground">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GEO DISCOVERY */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-4">Discover</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Find the Right Fit Near You</h2>
            <p className="text-muted-foreground mb-8">
              Gyms nearby. Trainers by goal — fat loss, yoga, strength, rehab. Online & offline options.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {["Fat Loss", "Strength", "Yoga", "Rehab", "Home Workout", "Online PT"].map((tag) => (
                <span key={tag} className="px-4 py-2 rounded-full bg-card border border-border text-sm">
                  {tag}
                </span>
              ))}
            </div>
            <Button size="lg" asChild>
              <Link to="/signup">
                <MapPin className="mr-2 h-5 w-5" />
                Explore Near You
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* DATA OWNERSHIP MOAT */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-card border border-border rounded-3xl p-8 md:p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <Badge variant="outline" className="mb-4">Data Ownership</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Data. Your Control.</h2>
            <div className="grid sm:grid-cols-2 gap-4 my-8 text-left max-w-2xl mx-auto">
              {[
                "You decide who can see your profile",
                "Revoke access anytime",
                "No gym lock-in",
                "No data loss when switching",
              ].map((p, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{p}</span>
                </div>
              ))}
            </div>
            <p className="text-lg md:text-xl font-semibold text-foreground italic">
              "You don't belong to a gym. Your fitness doesn't either."
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 max-w-3xl mx-auto leading-tight">
            Start Your Fitness Journey — Without Ever Restarting It
          </h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
            2 months free. No commitment. Works with or without a gym.
          </p>
          <Button size="lg" variant="secondary" asChild className="text-base px-8 h-12 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
            <Link to="/signup">
              Start Free Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Dumbbell className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">Fitness OS</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Built for real people, not just gyms · Designed for India, scalable globally
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/login" className="hover:text-foreground transition-colors">Sign In</Link>
              <Link to="/signup" className="hover:text-foreground transition-colors">Start Free</Link>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-6">
            © {new Date().getFullYear()} Fitness OS. Your data, your control.
          </p>
        </div>
      </footer>
    </div>
  );
}
