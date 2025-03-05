/**
 * Types pour le module de gestion des modules
 */

// Définit les statuts possibles pour un module
export type ModuleStatus = 'active' | 'inactive' | 'degraded' | 'maintenance';

// Définit la structure d'un module d'application
export interface AppModule {
  id: string;
  name: string;
  code: string;
  status: ModuleStatus;
  description?: string;
  is_core: boolean;
  version?: string;
  is_admin?: boolean;
  priority?: number;
  created_at?: string;
  updated_at?: string;
}

// Définit la structure d'une fonctionnalité de module
export interface ModuleFeature {
  id: string;
  module_code: string;
  feature_code: string;
  is_enabled: boolean;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

// Définit la structure d'une dépendance de module
export interface ModuleDependency {
  module_id: string;
  module_code: string;
  module_name: string;
  module_status: ModuleStatus;
  dependency_id: string;
  dependency_code: string;
  dependency_name: string;
  dependency_status: ModuleStatus;
  is_required: boolean;
}
