
/**
 * Fournisseur de dépendances pour les services utilisateur
 * Point d'entrée unique pour les services utilisateur
 */
import { UserService } from './userService';
import { SupabaseUserRepository } from './supabaseUserRepository';

// Singleton pour le repository utilisateur
const userRepository = new SupabaseUserRepository();

// Singleton pour le service utilisateur
const userService = new UserService(userRepository);

export const getUserService = (): UserService => {
  return userService;
};
