
import { ModuleStatus } from '../types';

/**
 * Type pour les changements en attente de statut de module
 */
export type PendingModuleChanges = Record<string, ModuleStatus>;

/**
 * Type pour les changements en attente de statut de fonctionnalité
 */
export type PendingFeatureChanges = Record<string, Record<string, boolean>>;

/**
 * Interface pour les options de synchronisation des modules
 */
export interface ModuleSyncOptions {
  forceRefresh?: boolean;
  silent?: boolean;
}

/**
 * Interface pour l'état de synchronisation des modules
 */
export interface ModuleSyncState {
  lastSyncTimestamp: number;
  isInitialized: boolean;
  hasError: boolean;
  errorMessage?: string;
}
