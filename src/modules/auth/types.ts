
/**
 * Types et interfaces pour le module d'authentification
 * Architecture en couches suivant les principes Clean Architecture
 */
import { User as SupabaseUser } from '@supabase/supabase-js';

// Événements d'authentification
export const AUTH_EVENTS = {
  SIGNED_IN: 'auth:signed-in',
  SIGNED_UP: 'auth:signed-up',
  SIGNED_OUT: 'auth:signed-out',
  PASSWORD_RECOVERY: 'auth:password-recovery',
  USER_UPDATED: 'auth:user-updated',
  USER_DELETED: 'auth:user-deleted',
  ERROR: 'auth:error'
};

// Type utilisateur
export type User = SupabaseUser;

// Type erreur d'authentification
export type AuthError = {
  message: string;
  stack?: string;
};

// Interface pour les métadonnées d'inscription
export interface SignUpMetadata {
  full_name?: string;
  username?: string;
  [key: string]: any;
}

// Interface pour le résultat d'authentification
export interface AuthResult {
  user: User | null;
  error: string | null;
}

// Interface pour le profil utilisateur
export interface Profile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  is_admin?: boolean;
  email_notifications?: boolean;
  preferred_language?: string;
  preferences?: Record<string, any>;
  visibility?: 'public' | 'private' | 'friends';
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

// Interface pour la mise à jour des données utilisateur
export interface UserUpdateData {
  username?: string;
  full_name?: string;
  avatar_url?: string;
  email_notifications?: boolean;
  preferred_language?: string;
  visibility?: 'public' | 'private' | 'friends';
  preferences?: Record<string, any>;
  [key: string]: any;
}

// Interface pour le repository d'authentification (couche Infrastructure)
export interface IAuthRepository {
  getCurrentUser(): Promise<User | null>;
  signIn(email: string, password: string): Promise<AuthResult>;
  signUp(email: string, password: string, metadata?: SignUpMetadata): Promise<AuthResult>;
  signOut(): Promise<{ error: string | null }>;
  subscribeToAuthChanges(callback: (user: User | null) => void): () => void;
}

// Interface pour le repository utilisateur (couche Infrastructure)
export interface IUserRepository {
  getUserProfile(userId: string): Promise<{ profile: Profile | null, error: string | null }>;
  updateUserProfile(userId: string, data: UserUpdateData): Promise<{ success: boolean, error: string | null }>;
  isUserAdmin(userId: string): Promise<boolean>;
}
