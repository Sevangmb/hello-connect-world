
/**
 * Fournisseur de dépendances pour les services d'authentification
 * Suit le principe d'inversion de dépendance (SOLID)
 */
import { SupabaseAuthRepository } from './supabaseAuthRepository';
import { AuthService } from './authService';

// Instance unique du repository d'authentification
let authRepository: SupabaseAuthRepository | null = null;

// Instance unique du service d'authentification
let authService: AuthService | null = null;

/**
 * Obtient une instance du repository d'authentification
 */
export const getAuthRepository = (): SupabaseAuthRepository => {
  if (!authRepository) {
    authRepository = new SupabaseAuthRepository();
  }
  return authRepository;
};

/**
 * Obtient une instance du service d'authentification
 */
export const getAuthService = (): AuthService => {
  if (!authService) {
    const repo = getAuthRepository();
    authService = new AuthService(repo);
  }
  return authService;
};
