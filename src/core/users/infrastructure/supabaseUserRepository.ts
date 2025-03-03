
/**
 * Repository des utilisateurs utilisant Supabase
 * Implémente l'interface IUserRepository
 */
import { supabase } from '@/integrations/supabase/client';
import { IUserRepository } from '../domain/interfaces/IUserRepository';
import { UserProfile, UserUpdateData } from '../domain/types';
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

      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url, visibility, phone, address, preferred_language, email_notifications, is_admin")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Erreur lors de la récupération du profil:", error);
        return null;
      }
      
      if (!data) {
        return null;
      }
      
      const profile = {
        id: userId,
        username: data.username || "",
        full_name: data.full_name || "",
        avatar_url: data.avatar_url,
        visibility: (data.visibility || "public") as "public" | "private",
        phone: data.phone || null,
        address: data.address || null,
        preferred_language: data.preferred_language || "fr",
        email_notifications: data.email_notifications ?? true,
        is_admin: data.is_admin || false
      };
      
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

      const { error } = await supabase
        .from("profiles")
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
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
        
        if (rpcError) {
          console.error("RPC error:", rpcError);
        } else if (isAdmin !== undefined) {
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
