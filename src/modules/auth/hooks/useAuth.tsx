
/**
 * Hook pour l'authentification utilisateur
 * Fournit toutes les fonctionnalités d'authentification nécessaires à l'application
 */
import React, { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";
import { getAuthService } from "../services/authDependencyProvider";
import { User, SignUpMetadata } from "../types";
import { useToast } from "@/hooks/use-toast";
import { eventBus } from "@/core/event-bus/EventBus";
import { AUTH_EVENTS } from "../types";

// Création d'un contexte d'authentification
const AuthContext = createContext<ReturnType<typeof useAuthProvider> | null>(null);

// Type pour les props du provider
interface AuthProviderProps {
  children: ReactNode;
}

// Hook principal d'authentification pour la logique interne
const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const authService = getAuthService();
  const { toast } = useToast();

  // Fonction pour récupérer l'état d'authentification actuel
  const refreshAuth = useCallback(async () => {
    try {
      console.log("Rafraîchissement de l'état d'authentification");
      setLoading(true);
      const currentUser = await authService.getCurrentUser();
      console.log("Utilisateur actuel:", currentUser ? 'Connecté' : 'Non connecté');
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      console.error("Erreur dans le rafraîchissement de l'authentification:", error);
      toast({
        variant: "destructive",
        title: "Erreur d'authentification",
        description: "Impossible de récupérer les informations de session",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [authService, toast]);

  useEffect(() => {
    // Récupération initiale de la session
    refreshAuth();

    // Écoute des changements d'authentification
    const unsubscribe = authService.subscribeToAuthChanges((currentUser) => {
      console.log("Changement d'état d'authentification:", currentUser ? 'Connecté' : 'Non connecté');
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [refreshAuth]);

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
      eventBus.publish(AUTH_EVENTS.SIGNED_OUT, {});
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
    refreshAuth,
    isAuthenticated: !!user
  };
};

// Composant Provider pour le contexte d'authentification
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuthProvider();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook pour utiliser le contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // Si le contexte est utilisé en dehors d'un provider, on retourne le hook direct
  if (!context) {
    // Utilisation du hook direct pour la rétrocompatibilité
    const authHook = useAuthProvider();
    // Ajouter AuthProvider pour la compatibilité avec l'ancienne API
    return {
      ...authHook,
      AuthProvider
    };
  }
  
  // Ajouter AuthProvider pour la compatibilité avec l'ancienne API
  return {
    ...context,
    AuthProvider
  };
};
