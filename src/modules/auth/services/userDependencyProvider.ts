
/**
 * Fournisseur de dépendances pour les services utilisateur
 * Suit le principe d'inversion de dépendance (SOLID)
 */
import { SupabaseUserRepository } from './supabaseUserRepository';
import { UserService } from './userService';

// Instance unique du repository utilisateur
let userRepository: SupabaseUserRepository | null = null;

// Instance unique du service utilisateur
let userService: UserService | null = null;

/**
 * Obtient une instance du repository utilisateur
 */
export const getUserRepository = (): SupabaseUserRepository => {
  if (!userRepository) {
    userRepository = new SupabaseUserRepository();
  }
  return userRepository;
};

/**
 * Obtient une instance du service utilisateur
 */
export const getUserService = (): UserService => {
  if (!userService) {
    const repo = getUserRepository();
    userService = new UserService(repo);
  }
  return userService;
};
