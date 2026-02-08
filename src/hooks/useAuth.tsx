import { useEffect, useState, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export type AppRole = "user" | "trainer" | "gym_admin" | "super_admin";

interface AuthState {
  user: User | null;
  session: Session | null;
  roles: AppRole[];
  isLoading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    roles: [],
    isLoading: true,
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchUserRoles = useCallback(async (userId: string): Promise<AppRole[]> => {
    try {
      const { data, error } = await supabase.rpc("get_user_roles", {
        _user_id: userId,
      });
      if (error) {
        console.error("Error fetching roles:", error);
        return ["user"];
      }
      return (data as AppRole[]) || ["user"];
    } catch (error) {
      console.error("Error fetching roles:", error);
      return ["user"];
    }
  }, []);

  useEffect(() => {
    // Set up auth state listener BEFORE getting session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Defer role fetch to avoid blocking
          const roles = await fetchUserRoles(session.user.id);
          setAuthState({
            user: session.user,
            session,
            roles,
            isLoading: false,
          });
        } else {
          setAuthState({
            user: null,
            session: null,
            roles: [],
            isLoading: false,
          });
        }

        // Handle auth events
        if (event === "SIGNED_OUT") {
          navigate("/login");
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const roles = await fetchUserRoles(session.user.id);
        setAuthState({
          user: session.user,
          session,
          roles,
          isLoading: false,
        });
      } else {
        setAuthState({
          user: null,
          session: null,
          roles: [],
          isLoading: false,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserRoles, navigate]);

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error.message,
      });
      return { error };
    }

    // Check if user is auto-confirmed (session exists immediately)
    if (data.session) {
      toast({
        title: "Account created!",
        description: "Welcome to Fitness OS. Let's set up your profile.",
      });
      navigate("/onboarding");
      return { data, autoConfirmed: true };
    }

    toast({
      title: "Check your email",
      description: "We sent you a confirmation link to verify your account.",
    });

    return { data, autoConfirmed: false };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error.message,
      });
      return { error };
    }

    toast({
      title: "Welcome back!",
      description: "You've successfully signed in.",
    });

    navigate("/dashboard");
    return { data };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: error.message,
      });
      return { error };
    }
    navigate("/login");
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
        description: error.message,
      });
      return { error };
    }

    toast({
      title: "Check your email",
      description: "We sent you a password reset link.",
    });

    return {};
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Password update failed",
        description: error.message,
      });
      return { error };
    }

    toast({
      title: "Password updated",
      description: "Your password has been successfully updated.",
    });

    return {};
  };

  const hasRole = (role: AppRole): boolean => {
    return authState.roles.includes(role);
  };

  const isAuthenticated = !!authState.session;

  return {
    ...authState,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    hasRole,
  };
}
