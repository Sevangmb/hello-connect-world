
/**
 * Repository utilisateur utilisant Supabase
 * Implémente l'interface IUserRepository
 */
import { supabase } from '@/integrations/supabase/client';
import { IUserRepository, UserUpdateData, Profile } from "../types";

export class SupabaseUserRepository implements IUserRepository {
  /**
   * Récupère le profil d'un utilisateur
   */
  async getUserProfile(userId: string) {
    try {
      if (!userId) {
        return { profile: null, error: "User ID is required" };
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return { profile: null, error: error.message };
      }

      return { profile: data as Profile, error: null };
    } catch (error) {
      console.error('Unexpected error fetching user profile:', error);
      return { profile: null, error: 'An unexpected error occurred while fetching the profile' };
    }
  }

  /**
   * Met à jour le profil d'un utilisateur
   */
  async updateUserProfile(userId: string, data: UserUpdateData) {
    try {
      if (!userId) {
        return { success: false, error: "User ID is required" };
      }

      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', userId);

      if (error) {
        console.error('Error updating user profile:', error);
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (error) {
      console.error('Unexpected error updating user profile:', error);
      return { success: false, error: 'An unexpected error occurred while updating the profile' };
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

      // Option 1: Vérifier via une RPC Supabase
      const { data, error } = await supabase.rpc('is_admin', {
        user_id: userId
      });

      if (error) {
        console.error('Error checking admin status via RPC:', error);
        
        // Option 2: Fallback sur une requête directe à la table profiles
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', userId)
          .single();

        if (profileError) {
          console.error('Error checking admin status via profiles table:', profileError);
          return false;
        }

        return !!profileData?.is_admin;
      }

      return !!data;
    } catch (error) {
      console.error('Unexpected error checking admin status:', error);
      return false;
    }
  }
}
