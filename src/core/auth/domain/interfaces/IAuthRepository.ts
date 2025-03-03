
/**
 * Interface pour le repository d'authentification
 * Définit les contrats pour les opérations d'authentification
 */
import { User, SignUpMetadata, AuthResult } from '../types';

export interface IAuthRepository {
  /**
   * Récupère l'utilisateur actuellement connecté
   */
  getCurrentUser(): Promise<User | null>;
  
  /**
   * Connecte un utilisateur avec email et mot de passe
   */
  signIn(email: string, password: string): Promise<AuthResult>;
  
  /**
   * Inscrit un nouvel utilisateur
   */
  signUp(email: string, password: string, metadata?: SignUpMetadata): Promise<AuthResult>;
  
  /**
   * Déconnecte l'utilisateur actuel
   */
  signOut(): Promise<{ error: string | null }>;
  
  /**
   * S'abonne aux changements d'état d'authentification
   */
  subscribeToAuthChanges(callback: (user: User | null) => void): () => void;
}
