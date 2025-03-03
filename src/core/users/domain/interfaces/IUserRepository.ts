
/**
 * Interface pour le repository des utilisateurs
 * Définit les contrats pour les opérations liées aux utilisateurs
 */
import { UserProfile, UserUpdateData } from '../types';

export interface IUserRepository {
  /**
   * Récupère le profil d'un utilisateur
   */
  getUserProfile(userId: string): Promise<UserProfile | null>;
  
  /**
   * Met à jour le profil d'un utilisateur
   */
  updateUserProfile(userId: string, data: UserUpdateData): Promise<{ success: boolean; error?: string }>;
  
  /**
   * Vérifie si un utilisateur est administrateur
   */
  isUserAdmin(userId: string): Promise<boolean>;
}
