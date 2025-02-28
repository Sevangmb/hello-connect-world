
// Types pour les modules et les fonctionnalités

export type ModuleStatus = 'active' | 'inactive' | 'degraded';

export interface AppModule {
  id: string;
  code: string;
  name: string;
  description: string;
  status: ModuleStatus;
  is_core: boolean;
  features?: Record<string, boolean>;
}

export interface ModuleDependency {
  id: string;
  module_id: string;
  module_code?: string;
  module_name?: string;
  module_status?: ModuleStatus;
  dependency_id: string;
  dependency_code?: string;
  dependency_name?: string;
  dependency_status?: ModuleStatus;
  is_required: boolean;
}

// Type pour la réponse brute de Supabase pour les dépendances
export interface RawModuleDependency {
  id: string;
  module_id: string;
  dependency_id: string;
  is_required: boolean;
  modules?: {
    module_code?: string;
    module_name?: string;
    module_status?: ModuleStatus;
  };
  dependencies?: {
    dependency_code?: string;
    dependency_name?: string;
    dependency_status?: ModuleStatus;
  };
}
