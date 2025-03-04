
/**
 * Service utilisateur - Couche Application
 * Implémente les cas d'utilisation liés aux profils utilisateurs
 */
import { IUserRepository, UserUpdateData } from "../types";

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
    
    return await this.userRepository.getUserProfile(userId);
  }
  
  /**
   * Met à jour le profil d'un utilisateur
   */
  async updateUserProfile(userId: string, data: UserUpdateData) {
    if (!userId) {
      return { success: false, error: "ID utilisateur requis" };
    }
    
    return await this.userRepository.updateUserProfile(userId, data);
  }
  
  /**
   * Vérifie si un utilisateur est administrateur
   */
  async isUserAdmin(userId: string): Promise<boolean> {
    if (!userId) {
      return false;
    }
    
    return await this.userRepository.isUserAdmin(userId);
  }
}
