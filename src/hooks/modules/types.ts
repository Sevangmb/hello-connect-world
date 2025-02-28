
// Garder le contenu existant s'il y en a, et ajouter les types manquants ci-dessous:

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
