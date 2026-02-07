import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dumbbell, 
  Shield, 
  Users, 
  Calendar,
  ArrowRight,
  CheckCircle2,
  Zap,
  Lock,
  TrendingUp,
  Clock,
  Star,
  ChevronRight
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Your Data, Forever Yours",
    description: "Your fitness journey follows you anywhere. Changing gyms or trainers never resets your history.",
  },
  {
    icon: Users,
    title: "Real Trainers, Real Programs",
    description: "No AI coaching gimmicks. Get personalized programs designed by certified professionals who understand your goals.",
  },
  {
    icon: Calendar,
    title: "Focus on Today's Workout",
    description: "No social feeds. No distractions. Just open the app and see exactly what you need to do today.",
  },
  {
    icon: Lock,
    title: "Privacy-First Medical Info",
    description: "Your injuries, allergies, and medical notes stay private. Share only what you choose, when you choose.",
  },
  {
    icon: TrendingUp,
    title: "Track Real Progress",
    description: "Strength PRs, weight milestones, consistency streaks—achievements you actually earned, not gamified badges.",
  },
  {
    icon: Clock,
    title: "Complete Fitness Timeline",
    description: "Every gym, every trainer, every milestone. Your entire fitness journey in one chronological story.",
  },
];

const benefits = [
  "Permanent fitness record that travels with you",
  "Medical & safety information kept private",
  "Connect with independent trainers or gym staff",
  "Track goals, achievements, and progress",
  "No AI coaching—real trainer expertise only",
  "Clean, mobile-first design",
];

const roles = [
  {
    title: "For Athletes",
    description: "Track workouts, log progress, and stay consistent with a system designed for serious training.",
    cta: "Start Training",
  },
  {
    title: "For Trainers",
    description: "Design programs, manage clients, and build your reputation with quality-focused tools.",
    cta: "Grow Your Practice",
  },
  {
    title: "For Gyms",
    description: "Manage trainers, host events, and connect with members without owning their data.",
    cta: "Partner With Us",
  },
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
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 md:py-28 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
              <Shield className="w-4 h-4" />
              User-owned • Trainer-driven • No social feed
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-tight">
              Your Fitness Journey,
              <br />
              <span className="text-primary relative">
                Finally Under Control
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/30" viewBox="0 0 100 12" preserveAspectRatio="none">
                  <path d="M0,8 Q50,0 100,8" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A serious fitness platform where <strong className="text-foreground">you own your data</strong>, 
              trainers design your programs, and gyms provide facilities—not lock-in.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" asChild className="text-base px-8 h-12 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
                <Link to="/signup">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base px-8 h-12 hover:bg-muted transition-colors">
                <Link to="/login">
                  Sign in
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                <span>Data encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <span>No credit card required</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for Serious Athletes
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              No gimmicks, no social distractions. Just a clean, professional platform 
              focused on what matters—your training.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-card rounded-2xl p-6 border border-border hover:border-primary/30 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="outline" className="mb-4">Why Fitness OS</Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Everything You Need,
                  <br />
                  Nothing You Don't
                </h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  We've stripped away the noise. No endless feeds, no AI coaches pretending 
                  to know you, no data lock-in. Just the tools to track, train, and grow.
                </p>
                <Button asChild className="shadow-md hover:shadow-lg transition-all">
                  <Link to="/signup">
                    Create Free Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="bg-muted/50 rounded-2xl p-6 border border-border">
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3 group">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">For Everyone</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              One Platform, Multiple Roles
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Whether you're training, coaching, or managing—Fitness OS adapts to your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {roles.map((role, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-6 border border-border hover:border-primary/30 transition-colors text-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{role.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{role.description}</p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/signup">{role.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Own Your Fitness?
          </h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
            Join athletes who take their training seriously. Your data travels with you, forever.
          </p>
          <Button size="lg" variant="secondary" asChild className="text-base px-8 h-12 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
            <Link to="/signup">
              Get Started Free
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
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/login" className="hover:text-foreground transition-colors">Sign In</Link>
              <Link to="/signup" className="hover:text-foreground transition-colors">Get Started</Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Fitness OS. Your data, your control.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}