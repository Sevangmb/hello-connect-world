
/**
 * Types communs pour les modules de l'application
 */

// Status possibles pour un module
export type ModuleStatus = 'active' | 'inactive' | 'degraded' | 'maintenance';

// Module de l'application
export interface AppModule {
  id: string;
  code: string;
  name: string;
  description: string;
  version: string;
  status: ModuleStatus;
  is_core: boolean;
  is_admin: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
  features?: Record<string, boolean>; // Ajout de features optionnel pour supporter statusManager
}

// Pour compatibilité avec le code existant (alias de AppModule)
export type Module = AppModule;

// Dépendance entre modules
export interface ModuleDependency {
  id: string;
  module_id: string;
  module_code: string;
  module_name: string;
  module_status: ModuleStatus;
  dependency_id: string;
  dependency_code: string;
  dependency_name: string;
  dependency_status: ModuleStatus;
  depends_on: string;
  is_required: boolean;
  created_at: string;
  updated_at: string;
}

// Feature de module
export interface ModuleFeature {
  id: string;
  module_code: string;
  feature_code: string;
  feature_name: string;
  description: string | null;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}
