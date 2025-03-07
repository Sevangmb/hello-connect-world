
import { AppModule, ModuleStatus } from '@/hooks/modules/types';
import { ModuleWithFeatures } from '../../repositories/ModuleFeatureRepository';

export interface IModuleService {
  initializeModules(): Promise<AppModule[]>;
  initializeModule(moduleCode: string): Promise<AppModule | null>;
  getModuleByCode(code: string): Promise<AppModule | null>;
  getActiveModules(): Promise<AppModule[]>;
  getAllModules(): Promise<AppModule[]>;
  isModuleActive(moduleCode: string): Promise<boolean>;
  getModuleStatus(moduleCode: string): Promise<ModuleStatus | null>;
  updateModuleStatus(moduleId: string, status: ModuleStatus): Promise<AppModule | null>;
  isFeatureEnabled(moduleCode: string, featureCode: string): Promise<boolean>;
  updateFeatureStatus(moduleCode: string, featureCode: string, isEnabled: boolean): Promise<boolean>;
  getCoreModules(): Promise<AppModule[]>;
  getModuleDependencies(moduleId: string): Promise<any[]>;
  recordModuleUsage(moduleCode: string): Promise<void>;
  getModulesWithFeatures(): Promise<ModuleWithFeatures[]>;
}
