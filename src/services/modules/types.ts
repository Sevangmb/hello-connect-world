
import { ModuleStatus } from '@/hooks/modules/types';

export interface ModuleFeature {
  id: string;
  module_id: string;
  code: string;
  name: string;
  description?: string;
  is_enabled: boolean;
  is_core: boolean;
  created_at: string;
  updated_at: string;
}

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
