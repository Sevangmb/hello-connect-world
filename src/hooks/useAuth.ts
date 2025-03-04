
/**
 * Hook pour l'authentification utilisateur
 * Utilise le microservice d'authentification
 */
import { useState, useEffect } from "react";
import { getAuthService } from "@/core/auth/infrastructure/authDependencyProvider";
import { User } from "@/core/auth/domain/types";
import { useToast } from "@/hooks/use-toast";

type SignUpMetadata = {
  username?: string;
  full_name?: string;
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const authService = getAuthService();
  const { toast } = useToast();

  useEffect(() => {
    // Récupération initiale de la session
    const initializeAuth = async () => {
      try {
        console.log("Initialisation de l'authentification");
        setLoading(true);
        const currentUser = await authService.getCurrentUser();
        console.log("Utilisateur actuel:", currentUser ? 'Connecté' : 'Non connecté');
        setUser(currentUser);
      } catch (error) {
        console.error("Erreur dans l'initialisation de l'authentification:", error);
        toast({
          variant: "destructive",
          title: "Erreur d'authentification",
          description: "Impossible de récupérer les informations de session",
        });
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Écoute des changements d'authentification
    const unsubscribe = authService.subscribeToAuthChanges((currentUser) => {
      console.log("Changement d'état d'authentification:", currentUser ? 'Connecté' : 'Non connecté');
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
      console.log("Tentative de connexion pour:", email);
      const { user, error } = await authService.signIn(email, password);
      
      if (error) {
        console.error("Erreur de connexion:", error);
        toast({
          variant: "destructive",
          title: "Échec de connexion",
          description: error,
        });
        return { error };
      }
      
      setUser(user);
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur FRING!",
      });
      return { error: null };
    } catch (error) {
      console.error("Erreur de connexion:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
      });
      return { error: error instanceof Error ? error.message : "Une erreur est survenue" };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: SignUpMetadata) => {
    setLoading(true);
    try {
      const { user, error } = await authService.signUp(email, password, metadata);
      
      if (error) {
        console.error("Erreur d'inscription:", error);
        toast({
          variant: "destructive",
          title: "Échec d'inscription",
          description: error,
        });
        return { data: null, error };
      }
      
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès. Veuillez vérifier votre e-mail pour confirmer votre compte.",
      });
      return { data: { user }, error: null };
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
      });
      return { data: null, error: error instanceof Error ? error.message : "Une erreur est survenue" };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await authService.signOut();
      
      if (error) {
        console.error("Erreur de déconnexion:", error);
        toast({
          variant: "destructive",
          title: "Erreur de déconnexion",
          description: error,
        });
        return { error };
      }
      
      setUser(null);
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt sur FRING!",
      });
      return { error: null };
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
      });
      return { error: error instanceof Error ? error.message : "Une erreur est survenue" };
    } finally {
      setLoading(false);
    }
  };

  return { 
    user, 
    loading, 
    signIn, 
    signUp, 
    signOut,
    isAuthenticated: !!user
  };
};
