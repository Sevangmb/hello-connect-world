
/**
 * Repository des utilisateurs utilisant Supabase
 * Implémente l'interface IUserRepository
 */
import { supabase } from '@/integrations/supabase/client';
import { IUserRepository } from '../domain/interfaces/IUserRepository';
import { UserProfile, UserUpdateData, BillingAddress } from '../domain/types';
import { eventBus } from '@/core/event-bus/EventBus';
import { USER_EVENTS } from '../domain/events';

export class SupabaseUserRepository implements IUserRepository {
  /**
   * Récupère le profil d'un utilisateur
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      if (!userId) {
        console.error("getUserProfile: userId est requis");
        return null;
      }

      // Récupérer les colonnes supplémentaires ajoutées pour la facturation
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url, visibility, phone, address, preferred_language, email_notifications, is_admin, billing_address, stripe_customer_id, default_payment_method_id")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Erreur lors de la récupération du profil:", error);
        return null;
      }
      
      if (!data) {
        return null;
      }
      
      // Construire l'objet de profil avec des valeurs par défaut sûres
      const profile: UserProfile = {
        id: userId,
        username: data.username || "",
        full_name: data.full_name || "",
        avatar_url: data.avatar_url,
        visibility: (data.visibility || "public") as "public" | "private" | "friends",
        phone: data.phone || null,
        address: data.address || null,
        preferred_language: data.preferred_language || "fr",
        email_notifications: data.email_notifications ?? true,
        is_admin: data.is_admin || false
      };
      
      // Convertir et ajouter billing_address si présent (conversion de Json à BillingAddress)
      if (data.billing_address) {
        // Cast via unknown pour éviter les problèmes de type
        profile.billing_address = data.billing_address as unknown as BillingAddress;
      }
      
      if (data.stripe_customer_id) {
        profile.stripe_customer_id = data.stripe_customer_id;
      }
      
      if (data.default_payment_method_id) {
        profile.default_payment_method_id = data.default_payment_method_id;
      }
      
      eventBus.publish(USER_EVENTS.PROFILE_FETCHED, { userId, profile });
      return profile;
    } catch (error) {
      console.error("Exception lors de la récupération du profil:", error);
      return null;
    }
  }

  /**
   * Met à jour le profil d'un utilisateur
   */
  async updateUserProfile(userId: string, data: UserUpdateData): Promise<{ success: boolean; error?: string }> {
    try {
      if (!userId) {
        return { success: false, error: "ID d'utilisateur requis" };
      }

      // Préparer les données pour la mise à jour
      // Utiliser any pour éviter les problèmes de type
      const updateData: any = {
        ...data,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", userId);

      if (error) {
        console.error("Erreur lors de la mise à jour du profil:", error);
        return { success: false, error: error.message };
      }
      
      eventBus.publish(USER_EVENTS.PROFILE_UPDATED, { 
        userId, 
        changes: data,
        timestamp: Date.now()
      });
      
      return { success: true };
    } catch (error: any) {
      console.error("Exception lors de la mise à jour du profil:", error);
      return { success: false, error: error.message || "Erreur de mise à jour du profil" };
    }
  }

  /**
   * Vérifie si un utilisateur est administrateur
   */
  async isUserAdmin(userId: string): Promise<boolean> {
    try {
      if (!userId) {
        return false;
      }
      
      // Essayer d'abord avec RPC si disponible
      try {
        const { data: isAdmin, error: rpcError } = await supabase.rpc('is_admin', {
          user_id: userId
        });
        
        if (!rpcError && isAdmin !== undefined) {
          return !!isAdmin;
        }
      } catch (error) {
        console.log("RPC not available, using direct query");
      }
      
      // Fallback à la requête directe
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("Erreur lors de la vérification du statut admin:", error);
        return false;
      }
      
      return data?.is_admin || false;
    } catch (error) {
      console.error("Exception lors de la vérification du statut admin:", error);
      return false;
    }
  }
}
