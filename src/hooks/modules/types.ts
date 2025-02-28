
export type ModuleStatus = 'active' | 'inactive' | 'degraded';

export interface AppModule {
  id: string;
  name: string;
  code: string;
  description: string | null;
  status: ModuleStatus;
  is_core: boolean;
  created_at: string;
  updated_at: string;
  features?: Record<string, boolean>;
}

export interface ModuleDependency {
  module_id: string;
  module_code: string;
  module_name: string;
  module_status: ModuleStatus;
  dependency_id: string | null;
  dependency_code: string | null;
  dependency_name: string | null;
  dependency_status: ModuleStatus | null;
  is_required: boolean | null;
}
