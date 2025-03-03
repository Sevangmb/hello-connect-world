
/**
 * Hook pour l'authentification utilisateur
 * Utilise le microservice d'authentification
 */
import { useState, useEffect } from "react";
import { getAuthService } from "@/core/auth/infrastructure/authDependencyProvider";
import { User } from "@/core/auth/domain/types";

type SignUpMetadata = {
  username?: string;
  full_name?: string;
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const authService = getAuthService();

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error in auth initialization:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const unsubscribe = authService.subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log("Attempting sign in for:", email);
      const { user, error } = await authService.signIn(email, password);
      
      if (error) return { error };
      
      setUser(user);
      return { error: null };
    } catch (error) {
      console.log("Sign in error:", error);
      return { error: error instanceof Error ? error.message : "Une erreur est survenue" };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: SignUpMetadata) => {
    setLoading(true);
    try {
      const { user, error } = await authService.signUp(email, password, metadata);
      
      if (error) return { data: null, error };
      
      return { data: { user }, error: null };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : "Une erreur est survenue" };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await authService.signOut();
      
      if (error) return { error };
      
      setUser(null);
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Une erreur est survenue" };
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, signIn, signUp, signOut };
};
