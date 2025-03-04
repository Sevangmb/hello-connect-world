
/**
 * Types pour le module d'authentification
 */
import { User as SupabaseUser, AuthError as SupabaseAuthError } from '@supabase/supabase-js';

// Réutiliser les types de Supabase pour la compatibilité
export type User = SupabaseUser;
export type AuthError = SupabaseAuthError;

export type SignUpMetadata = {
  username?: string;
  full_name?: string;
  [key: string]: any;
};

export interface AuthResult {
  user: User | null;
  error: string | null;
}

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

export interface UserUpdateData {
  username?: string;
  full_name?: string;
  avatar_url?: string | null;
  visibility?: "public" | "private";
  phone?: string | null;
  address?: string | null;
  preferred_language?: string;
  email_notifications?: boolean;
}

export interface Profile {
  id: string;  
  username: string;
  full_name: string;
  avatar_url: string | null;
  visibility: "public" | "private";
  phone: string | null;
  address: string | null;
  preferred_language: string;
  email_notifications: boolean;
}

export interface IUserRepository {
  getUserProfile(userId: string): Promise<{ profile: Profile | null; error: string | null }>;
  updateUserProfile(userId: string, data: UserUpdateData): Promise<{ success: boolean; error: string | null }>;
  isUserAdmin(userId: string): Promise<boolean>;
}

// Constantes pour les événements d'authentification
export const AUTH_EVENTS = {
  SIGNED_IN: 'auth:signed_in',
  SIGNED_UP: 'auth:signed_up',
  SIGNED_OUT: 'auth:signed_out',
  SESSION_EXPIRED: 'auth:session_expired',
  USER_UPDATED: 'auth:user_updated',
  PASSWORD_RECOVERY: 'auth:password_recovery',
  PASSWORD_RESET: 'auth:password_reset',
};
