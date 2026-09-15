import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export type AppRole = "user" | "trainer" | "gym_admin" | "super_admin";

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  phone: string | null;
  date_of_birth: string | null;
  gender: string | null;
  location: string | null;
  city: string | null;
  fitness_id: string | null;
  onboarding_completed: boolean;
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  roles: AppRole[];
  isLoading: boolean;
  isProfileLoading: boolean;
  isAuthenticated: boolean;
  profileError: string | null;
  hasRole: (role: AppRole) => boolean;
  refreshProfile: () => Promise<void>;
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error?: unknown; data?: unknown; autoConfirmed?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error?: unknown; data?: unknown }>;
  signOut: () => Promise<{ error?: unknown }>;
  resetPassword: (email: string) => Promise<{ error?: unknown }>;
  updatePassword: (newPassword: string) => Promise<{ error?: unknown }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function friendlyAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("already registered") || m.includes("already been registered"))
    return "That email already has a FitHit account. Try signing in instead.";
  if (m.includes("invalid login credentials")) return "Email or password is incorrect.";
  if (m.includes("email not confirmed"))
    return "Please confirm your email first — check your inbox for the link.";
  if (m.includes("password")) return message;
  if (m.includes("failed to fetch") || m.includes("network"))
    return "Network problem. Check your connection and try again.";
  return message;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const loadedFor = useRef<string | null>(null);

  const loadUserData = useCallback(async (userId: string) => {
    setIsProfileLoading(true);
    setProfileError(null);
    try {
      const [profileRes, rolesRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle(),
        supabase.rpc("get_user_roles", { _user_id: userId }),
      ]);

      if (profileRes.error) {
        setProfileError(profileRes.error.message);
      } else {
        setProfile((profileRes.data as unknown as Profile) ?? null);
      }
      setRoles(rolesRes.error ? ["user"] : ((rolesRes.data as AppRole[]) ?? ["user"]));
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Could not load your profile.");
    } finally {
      setIsProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    // Register the listener first so no event is missed.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (nextSession?.user) {
        if (loadedFor.current !== nextSession.user.id) {
          loadedFor.current = nextSession.user.id;
          // Defer the Supabase call out of the callback to avoid deadlocks.
          setTimeout(() => {
            if (active) void loadUserData(nextSession.user.id);
          }, 0);
        }
      } else {
        loadedFor.current = null;
        setProfile(null);
        setRoles([]);
      }

      // Auth has resolved as soon as we know the session state.
      setIsLoading(false);
    });

    // Then hydrate the existing session from storage.
    supabase.auth.getSession().then(({ data: { session: existing } }) => {
      if (!active) return;
      setSession(existing);
      setUser(existing?.user ?? null);
      if (existing?.user && loadedFor.current !== existing.user.id) {
        loadedFor.current = existing.user.id;
        void loadUserData(existing.user.id);
      }
      setIsLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [loadUserData]);

  const refreshProfile = useCallback(async () => {
    if (user) await loadUserData(user.id);
  }, [user, loadUserData]);

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { full_name: fullName },
      },
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: friendlyAuthError(error.message),
      });
      return { error };
    }

    if (data.session) {
      toast({ title: "Welcome to FitHit", description: "Let's set up your profile." });
      navigate("/onboarding", { replace: true });
      return { data, autoConfirmed: true };
    }

    toast({
      title: "Check your email",
      description: "We sent you a confirmation link to verify your account.",
    });
    return { data, autoConfirmed: false };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: friendlyAuthError(error.message),
      });
      return { error };
    }

    const userId = data.user.id;

    // Apply any pending role chosen during a trainer/gym signup.
    const pendingRole = localStorage.getItem("pending_role") as AppRole | null;
    const pendingRedirect = localStorage.getItem("pending_role_redirect");
    if (pendingRole === "trainer" || pendingRole === "gym_admin") {
      const { error: roleErr } = await supabase.rpc("self_assign_role", { _role: pendingRole });
      localStorage.removeItem("pending_role");
      localStorage.removeItem("pending_role_redirect");
      if (!roleErr && pendingRedirect) {
        toast({ title: "Welcome back" });
        navigate(pendingRedirect, { replace: true });
        return { data };
      }
    }

    const { data: prof } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("user_id", userId)
      .maybeSingle();

    toast({ title: "Welcome back" });
    navigate(prof?.onboarding_completed ? "/dashboard" : "/onboarding", { replace: true });
    return { data };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error && !error.message.toLowerCase().includes("session")) {
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: friendlyAuthError(error.message),
      });
      return { error };
    }
    setSession(null);
    setUser(null);
    setProfile(null);
    setRoles([]);
    loadedFor.current = null;
    navigate("/login", { replace: true });
    return {};
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast({
        variant: "destructive",
        title: "Password reset failed",
        description: friendlyAuthError(error.message),
      });
      return { error };
    }
    toast({ title: "Check your email", description: "We sent you a password reset link." });
    return {};
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast({
        variant: "destructive",
        title: "Password update failed",
        description: friendlyAuthError(error.message),
      });
      return { error };
    }
    toast({ title: "Password updated" });
    return {};
  };

  const value: AuthContextValue = {
    user,
    session,
    profile,
    roles,
    isLoading,
    isProfileLoading,
    isAuthenticated: !!session,
    profileError,
    hasRole: (role: AppRole) => roles.includes(role),
    refreshProfile,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
