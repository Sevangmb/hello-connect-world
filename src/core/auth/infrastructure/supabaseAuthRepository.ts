
/**
 * Repository d'authentification utilisant Supabase
 * Implémente l'interface IAuthRepository
 */
import { supabase } from '@/integrations/supabase/client';
import { IAuthRepository } from '../domain/interfaces/IAuthRepository';
import { User, SignUpMetadata, AuthError, AuthResult } from '../domain/types';
import { eventBus } from '@/core/event-bus/EventBus';
import { AUTH_EVENTS } from '../domain/events';

export class SupabaseAuthRepository implements IAuthRepository {
  /**
   * Récupère l'utilisateur actuellement connecté
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      // Vérifier d'abord la session actuelle
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Erreur lors de la récupération de la session:", sessionError);
        return null;
      }
      
      if (!session) {
        console.log("Aucune session active");
        return null;
      }
      
      // Si nous avons une session, récupérer l'utilisateur
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("Erreur lors de la récupération de l'utilisateur:", userError);
        return null;
      }
      
      return user;
    } catch (error) {
      console.error("Exception lors de la récupération de l'utilisateur:", error);
      return null;
    }
  }

  /**
   * Connecte un utilisateur avec email et mot de passe
   */
  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      console.log("Tentative de connexion avec", email);
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password,
      });
      
      if (error) {
        console.error("Erreur de connexion:", error);
        return { user: null, error: this.formatAuthError(error) };
      }
      
      console.log("Connexion réussie pour", email);
      eventBus.publish(AUTH_EVENTS.SIGNED_IN, { user: data.user });
      return { user: data.user, error: null };
    } catch (error) {
      console.error("Exception lors de la connexion:", error);
      return { 
        user: null, 
        error: "Une erreur inattendue est survenue lors de la connexion" 
      };
    }
  }

  /**
   * Inscrit un nouvel utilisateur
   */
  async signUp(email: string, password: string, metadata?: SignUpMetadata): Promise<AuthResult> {
    try {
      console.log("Tentative d'inscription pour", email);
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
        return { user: null, error: this.formatAuthError(error) };
      }
      
      console.log("Inscription réussie pour", email);
      eventBus.publish(AUTH_EVENTS.SIGNED_UP, { user: data.user });
      return { user: data.user, error: null };
    } catch (error) {
      console.error("Exception lors de l'inscription:", error);
      return { 
        user: null, 
        error: "Une erreur inattendue est survenue lors de l'inscription" 
      };
    }
  }

  /**
   * Déconnecte l'utilisateur actuel
   */
  async signOut(): Promise<{ error: string | null }> {
    try {
      console.log("Tentative de déconnexion");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Erreur de déconnexion:", error);
        return { error: this.formatAuthError(error) };
      }
      
      console.log("Déconnexion réussie");
      eventBus.publish(AUTH_EVENTS.SIGNED_OUT, {});
      return { error: null };
    } catch (error) {
      console.error("Exception lors de la déconnexion:", error);
      return { error: "Une erreur inattendue est survenue lors de la déconnexion" };
    }
  }

  /**
   * S'abonne aux changements d'état d'authentification
   */
  subscribeToAuthChanges(callback: (user: User | null) => void): () => void {
    console.log("Mise en place de l'écoute des changements d'authentification");
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Événement d'authentification:", event);
      if (event === 'SIGNED_OUT') {
        callback(null);
      } else if (session?.user) {
        callback(session.user);
      }
    });

    return () => {
      console.log("Nettoyage de l'écoute des changements d'authentification");
      subscription.unsubscribe();
    };
  }

  /**
   * Formatte les erreurs d'authentification Supabase en messages utilisateur
   */
  private formatAuthError(error: AuthError): string {
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
    
    return error.message || "Une erreur est survenue lors de l'authentification";
  }
}
