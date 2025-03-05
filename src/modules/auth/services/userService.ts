
/**
 * Service utilisateur - Couche Application
 * Implémente les cas d'utilisation liés aux utilisateurs
 */
import { IUserRepository, Profile, UserUpdateData } from "../types";
import { eventBus } from '@/core/event-bus/EventBus';

// Événements utilisateur
export const USER_EVENTS = {
  PROFILE_UPDATED: 'user:profile-updated',
  PROFILE_ERROR: 'user:profile-error'
};

export class UserService {
  private userRepository: IUserRepository;
  
  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }
  
  /**
   * Récupère le profil d'un utilisateur
   */
  async getUserProfile(userId: string) {
    if (!userId) {
      return { profile: null, error: "ID utilisateur requis" };
    }
    
    try {
      return await this.userRepository.getUserProfile(userId);
    } catch (error: any) {
      const errorMessage = error.message || "Erreur lors de la récupération du profil";
      eventBus.publish(USER_EVENTS.PROFILE_ERROR, { userId, error: errorMessage });
      return { profile: null, error: errorMessage };
    }
  }
  
  /**
   * Met à jour le profil d'un utilisateur
   */
  async updateUserProfile(userId: string, data: UserUpdateData) {
    if (!userId) {
      return { success: false, error: "ID utilisateur requis" };
    }
    
    try {
      const result = await this.userRepository.updateUserProfile(userId, data);
      
      if (result.success) {
        eventBus.publish(USER_EVENTS.PROFILE_UPDATED, { userId, data });
      }
      
      return result;
    } catch (error: any) {
      const errorMessage = error.message || "Erreur lors de la mise à jour du profil";
      eventBus.publish(USER_EVENTS.PROFILE_ERROR, { userId, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  }
  
  /**
   * Vérifie si un utilisateur est administrateur
   */
  async isUserAdmin(userId: string): Promise<boolean> {
    if (!userId) {
      return false;
    }
    
    try {
      return await this.userRepository.isUserAdmin(userId);
    } catch (error) {
      console.error("Erreur lors de la vérification du statut administrateur:", error);
      return false;
    }
  }
}
