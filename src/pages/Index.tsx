import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Dumbbell, 
  Shield, 
  Users, 
  Calendar,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Your Data, Your Control",
    description: "All your fitness data is permanently yours. Leaving a gym never resets your history.",
  },
  {
    icon: Users,
    title: "Trainer-Driven Programs",
    description: "Get personalized workouts designed by certified trainers who understand your goals.",
  },
  {
    icon: Calendar,
    title: "Daily Focused Training",
    description: "See only what matters today. No distractions, no social feed—just your workout.",
  },
];

const benefits = [
  "Permanent fitness record that travels with you",
  "Medical & safety information kept private",
  "Connect with independent trainers or gym staff",
  "Track goals, achievements, and progress",
  "No AI coaching—real trainer expertise only",
  "Mobile-first, clean design",
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">Fitness OS</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Shield className="w-4 h-4" />
              User-owned • Trainer-driven • No social feed
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
              Your Fitness Journey,
              <br />
              <span className="text-primary">Finally Under Control</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              A serious fitness platform where you own your data, trainers design your programs, 
              and gyms provide facilities—not lock-in.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" asChild className="text-base px-8">
                <Link to="/signup">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base px-8">
                <Link to="/login">Sign in</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for Serious Athletes
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              No gimmicks, no social distractions. Just a clean, professional platform 
              focused on what matters—your training.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Everything You Need,
                  <br />
                  Nothing You Don't
                </h2>
                <p className="text-muted-foreground mb-8">
                  We've stripped away the noise. No endless feeds, no AI coaches pretending 
                  to know you, no data lock-in. Just the tools to track, train, and grow.
                </p>
                <Button asChild>
                  <Link to="/signup">
                    Create Free Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Own Your Fitness?
          </h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
            Join athletes who take their training seriously. Your data travels with you, forever.
          </p>
          <Button size="lg" variant="secondary" asChild className="text-base px-8">
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
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Fitness OS. Your data, your control.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
