
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, AuthError } from "@supabase/supabase-js";

type SignUpMetadata = {
  username?: string;
  full_name?: string;
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { user: currentUser }, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Error getting user:", error);
          await supabase.auth.signOut();
        }
        setUser(currentUser);
      } catch (error) {
        console.error("Error in auth initialization:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      if (event === 'SIGNED_OUT') {
        setUser(null);
      } else if (session?.user) {
        setUser(session.user);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAuthError = (error: AuthError) => {
    console.error("Auth error:", error);
    
    // Handle specific error cases
    if (error.message.includes("rejected")) {
      return "L'authentification a été annulée. Veuillez réessayer.";
    }
    if (error.message.includes("Email not confirmed")) {
      return "Veuillez confirmer votre adresse e-mail avant de vous connecter.";
    }
    if (error.message.includes("Invalid login credentials")) {
      return "Email ou mot de passe invalide.";
    }
    if (error.message.includes("chrome-extension")) {
      return "Une extension Chrome interfère avec l'authentification. Essayez de désactiver vos extensions ou d'utiliser le mode navigation privée.";
    }
    
    return error.message;
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password,
      });
      
      if (error) throw error;
      setUser(data.user);
      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      return { error: handleAuthError(authError) };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: SignUpMetadata) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      const authError = error as AuthError;
      return { data: null, error: handleAuthError(authError) };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      return { error: handleAuthError(authError) };
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, signIn, signUp, signOut };
};

