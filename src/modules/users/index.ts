/**
 * Module utilisateurs - Point d'entrée unique
 * Exporte tous les composants, hooks et utilitaires liés aux utilisateurs
 */

// Composants
export { UserSearch } from '@/components/users/UserSearch';
export { UserButton } from '@/components/UserButton';

// Services et repositories
export { UserService } from '@/core/users/application/UserService';
export { SupabaseUserRepository } from '@/core/users/infrastructure/supabaseUserRepository';

// Types et événements
export * from '@/core/users/domain/types';
export * from '@/core/users/domain/events';
export * from '@/core/users/domain/interfaces/IUserRepository';
