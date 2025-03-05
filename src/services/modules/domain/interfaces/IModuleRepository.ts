
import { AppModule, ModuleStatus } from '@/hooks/modules/types';

export interface IModuleRepository {
  getAllModules(): Promise<AppModule[]>;
  getModuleById(id: string): Promise<AppModule | null>;
  getModuleByCode(code: string): Promise<AppModule | null>;
  updateModuleStatus(id: string, status: ModuleStatus): Promise<boolean>;
  getModuleDependencies(moduleId: string): Promise<any[]>;
}
