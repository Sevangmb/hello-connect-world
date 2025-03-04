
/**
 * Fournisseur de dépendances pour l'authentification
 * Point d'entrée unique pour les services d'authentification
 */
import { AuthService } from './authService';
import { SupabaseAuthRepository } from './supabaseAuthRepository';

// Singleton pour le repository d'authentification
const authRepository = new SupabaseAuthRepository();

// Singleton pour le service d'authentification
const authService = new AuthService(authRepository);

export const getAuthService = (): AuthService => {
  return authService;
};
