import { Link } from "react-router-dom";
import { Dumbbell } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Dumbbell className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">Fitness OS</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Your fitness history. Owned by you. Not your gym.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">For Users</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/signup" className="hover:text-foreground">Create account</Link></li>
            <li><Link to="/login" className="hover:text-foreground">Sign in</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">For Trainers</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/signup/trainer" className="hover:text-foreground">Trainer signup</Link></li>
            <li><Link to="/login" className="hover:text-foreground">Trainer login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">For Gyms</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/signup/gym" className="hover:text-foreground">List your gym</Link></li>
            <li><Link to="/login" className="hover:text-foreground">Gym login</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Fitness OS. Built for real people, not just gyms.
      </div>
    </footer>
  );
}
