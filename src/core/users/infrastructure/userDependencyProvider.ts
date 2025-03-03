
/**
 * Fournisseur de dépendances pour les utilisateurs
 * Point d'entrée unique pour les services utilisateurs
 */
import { UserService } from '../application/UserService';
import { SupabaseUserRepository } from './supabaseUserRepository';

// Singleton pour le repository des utilisateurs
const userRepository = new SupabaseUserRepository();

// Singleton pour le service des utilisateurs
const userService = new UserService(userRepository);

export const getUserService = (): UserService => {
  return userService;
};
