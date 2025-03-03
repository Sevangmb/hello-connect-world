
/**
 * Types pour le domaine d'authentification
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
