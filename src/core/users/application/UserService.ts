
/**
 * Service des utilisateurs - Couche Application
 * Implémente les cas d'utilisation liés aux utilisateurs
 */
import { IUserRepository } from '../domain/interfaces/IUserRepository';
import { UserProfile, UserUpdateData, UserProfileResult } from '../domain/types';

export class UserService {
  private userRepository: IUserRepository;
  private cache: Map<string, { profile: UserProfile, timestamp: number }> = new Map();
  private readonly CACHE_TTL = 60000; // 1 minute
  
  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }
  
  /**
   * Récupère le profil d'un utilisateur avec gestion de cache
   */
  async getUserProfile(userId: string): Promise<UserProfileResult> {
    if (!userId) {
      return { profile: null, error: "ID d'utilisateur requis" };
    }
    
    // Vérifier le cache
    const cached = this.cache.get(userId);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return { profile: cached.profile };
    }
    
    // Récupérer depuis le repository
    const profile = await this.userRepository.getUserProfile(userId);
    
    if (profile) {
      // Mettre en cache
      this.cache.set(userId, { profile, timestamp: Date.now() });
      return { profile };
    }
    
    return { profile: null, error: "Profil non trouvé" };
  }
  
  /**
   * Met à jour le profil d'un utilisateur
   */
  async updateUserProfile(userId: string, data: UserUpdateData): Promise<{ success: boolean; error?: string }> {
    if (!userId) {
      return { success: false, error: "ID d'utilisateur requis" };
    }
    
    const result = await this.userRepository.updateUserProfile(userId, data);
    
    if (result.success) {
      // Invalider le cache
      this.cache.delete(userId);
    }
    
    return result;
  }
  
  /**
   * Vérifie si un utilisateur est administrateur
   */
  async isUserAdmin(userId: string): Promise<boolean> {
    if (!userId) {
      return false;
    }
    
    // Vérifier d'abord dans le cache
    const cached = this.cache.get(userId);
    if (cached && cached.profile.is_admin !== undefined) {
      return !!cached.profile.is_admin;
    }
    
    return await this.userRepository.isUserAdmin(userId);
  }
  
  /**
   * Invalide le cache pour un utilisateur
   */
  invalidateCache(userId: string): void {
    this.cache.delete(userId);
  }
  
  /**
   * Efface tout le cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}
