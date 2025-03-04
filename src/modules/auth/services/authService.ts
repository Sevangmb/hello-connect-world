
/**
 * Service d'authentification - Couche Application
 * Implémente les cas d'utilisation liés à l'authentification
 */
import { IAuthRepository } from "../types";
import { User, SignUpMetadata, AuthResult } from "../types";

export class AuthService {
  private authRepository: IAuthRepository;
  
  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
  }
  
  /**
   * Récupère l'utilisateur actuellement connecté
   */
  async getCurrentUser(): Promise<User | null> {
    return await this.authRepository.getCurrentUser();
  }
  
  /**
   * Connecte un utilisateur avec email et mot de passe
   */
  async signIn(email: string, password: string): Promise<AuthResult> {
    if (!email || !password) {
      return { user: null, error: "Email et mot de passe requis" };
    }
    
    return await this.authRepository.signIn(email, password);
  }
  
  /**
   * Inscrit un nouvel utilisateur
   */
  async signUp(email: string, password: string, metadata?: SignUpMetadata): Promise<AuthResult> {
    if (!email || !password) {
      return { user: null, error: "Email et mot de passe requis" };
    }
    
    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { user: null, error: "Format d'email invalide" };
    }
    
    // Validation basique du mot de passe
    if (password.length < 6) {
      return { user: null, error: "Le mot de passe doit contenir au moins 6 caractères" };
    }
    
    return await this.authRepository.signUp(email, password, metadata);
  }
  
  /**
   * Déconnecte l'utilisateur actuel
   */
  async signOut(): Promise<{ error: string | null }> {
    return await this.authRepository.signOut();
  }
  
  /**
   * S'abonne aux changements d'état d'authentification
   */
  subscribeToAuthChanges(callback: (user: User | null) => void): () => void {
    return this.authRepository.subscribeToAuthChanges(callback);
  }
}
