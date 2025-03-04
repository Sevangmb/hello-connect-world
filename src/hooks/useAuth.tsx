
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: false,
  });
  const { toast } = useToast();

  // Initialiser l'état de l'authentification
  const initAuth = useCallback(async () => {
    try {
      console.log("Initialisation de l'authentification");
      
      // Vérifier s'il y a une session active
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Erreur lors de la récupération de la session:", error);
        setState({ user: null, loading: false, isAuthenticated: false });
        return;
      }
      
      if (session) {
        console.log("Session active trouvée:", session.user.id);
        setState({ 
          user: session.user, 
          loading: false, 
          isAuthenticated: true 
        });
      } else {
        console.log("Aucune session active");
        setState({ user: null, loading: false, isAuthenticated: false });
      }
    } catch (error) {
      console.error("Exception dans l'initialisation de l'authentification:", error);
      toast({
        variant: "destructive",
        title: "Erreur d'authentification",
        description: "Impossible de récupérer votre session",
      });
      setState({ user: null, loading: false, isAuthenticated: false });
    }
  }, [toast]);

  useEffect(() => {
    // Initialiser l'authentification au chargement
    initAuth();
    
    // S'abonner aux changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Événement d'authentification détecté:", event);
        
        if (event === "SIGNED_IN" && session) {
          console.log("Utilisateur connecté:", session.user.id);
          setState({ 
            user: session.user, 
            loading: false, 
            isAuthenticated: true 
          });
          
          toast({
            title: "Connexion réussie",
            description: "Bienvenue sur FRING!",
          });
        } 
        else if (event === "SIGNED_OUT" || event === "USER_DELETED") {
          console.log("Utilisateur déconnecté");
          setState({ user: null, loading: false, isAuthenticated: false });
          
          if (event === "SIGNED_OUT") {
            toast({
              title: "Déconnexion réussie",
              description: "À bientôt sur FRING!",
            });
          }
        }
        else if (event === "TOKEN_REFRESHED" && session) {
          console.log("Token rafraîchi pour l'utilisateur:", session.user.id);
          setState({ 
            user: session.user, 
            loading: false, 
            isAuthenticated: true 
          });
        }
        else if (event === "USER_UPDATED" && session) {
          console.log("Utilisateur mis à jour:", session.user.id);
          setState({
            user: session.user,
            loading: false,
            isAuthenticated: true
          });
        }
      }
    );

    // Nettoyer l'abonnement
    return () => {
      subscription.unsubscribe();
      console.log("Abonnement aux changements d'authentification nettoyé");
    };
  }, [initAuth, toast]);

  // Fonction de connexion
  const signIn = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      console.log("Tentative de connexion pour:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Erreur de connexion:", error);
        toast({
          variant: "destructive",
          title: "Échec de connexion",
          description: formatAuthError(error),
        });
        setState(prev => ({ ...prev, loading: false }));
        return { error: formatAuthError(error) };
      }
      
      console.log("Connexion réussie pour:", email);
      return { error: null };
    } catch (error: any) {
      console.error("Exception lors de la connexion:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
      });
      setState(prev => ({ ...prev, loading: false }));
      return { error: error instanceof Error ? error.message : "Une erreur est survenue" };
    }
  };

  // Fonction d'inscription
  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      if (!email || !password) {
        toast({
          variant: "destructive",
          title: "Champs requis",
          description: "Email et mot de passe sont requis",
        });
        setState(prev => ({ ...prev, loading: false }));
        return { data: null, error: "Email et mot de passe sont requis" };
      }
      
      // Validation basique de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast({
          variant: "destructive",
          title: "Format invalide",
          description: "Format d'email invalide",
        });
        setState(prev => ({ ...prev, loading: false }));
        return { data: null, error: "Format d'email invalide" };
      }
      
      // Validation basique du mot de passe
      if (password.length < 6) {
        toast({
          variant: "destructive",
          title: "Mot de passe trop court",
          description: "Le mot de passe doit contenir au moins 6 caractères",
        });
        setState(prev => ({ ...prev, loading: false }));
        return { data: null, error: "Le mot de passe doit contenir au moins 6 caractères" };
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        console.error("Erreur d'inscription:", error);
        toast({
          variant: "destructive",
          title: "Échec d'inscription",
          description: formatAuthError(error),
        });
        setState(prev => ({ ...prev, loading: false }));
        return { data: null, error: formatAuthError(error) };
      }
      
      console.log("Inscription réussie:", data);
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès. Veuillez vérifier votre e-mail pour confirmer votre compte.",
      });
      setState(prev => ({ ...prev, loading: false }));
      return { data, error: null };
    } catch (error: any) {
      console.error("Exception lors de l'inscription:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
      });
      setState(prev => ({ ...prev, loading: false }));
      return { data: null, error: error instanceof Error ? error.message : "Une erreur est survenue" };
    }
  };

  // Fonction de déconnexion
  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Erreur de déconnexion:", error);
        toast({
          variant: "destructive",
          title: "Erreur de déconnexion",
          description: formatAuthError(error),
        });
        setState(prev => ({ ...prev, loading: false }));
        return { error: formatAuthError(error) };
      }
      
      return { error: null };
    } catch (error: any) {
      console.error("Exception lors de la déconnexion:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
      });
      setState(prev => ({ ...prev, loading: false }));
      return { error: error instanceof Error ? error.message : "Une erreur est survenue" };
    }
  };

  // Formatter les erreurs d'authentification
  const formatAuthError = (error: any): string => {
    if (!error || !error.message) return "Une erreur inconnue est survenue";
    
    if (error.message.includes("rejected")) {
      if (error.stack?.includes("chrome-extension")) {
        return "Un bloqueur de publicité ou une extension Chrome interfère avec l'authentification. Essayez de :\n1. Désactiver vos extensions\n2. Utiliser le mode navigation privée\n3. Utiliser un autre navigateur";
      }
      return "L'authentification a été rejetée. Veuillez réessayer.";
    }
    if (error.message.includes("Email not confirmed")) {
      return "Veuillez confirmer votre adresse e-mail avant de vous connecter.";
    }
    if (error.message.includes("Invalid login credentials")) {
      return "Email ou mot de passe invalide.";
    }
    if (error.message.includes("already registered")) {
      return "Cet email est déjà enregistré.";
    }
    
    return error.message || "Une erreur est survenue lors de l'authentification";
  };

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    refreshAuth: initAuth,
  };
};
