
import { ModuleFeature } from '@/hooks/modules/types';

export interface IFeatureRepository {
  getAllFeatures(): Promise<ModuleFeature[]>;
  getFeaturesByModule(moduleCode: string): Promise<ModuleFeature[]>;
  getFeatureByCode(moduleCode: string, featureCode: string): Promise<ModuleFeature | null>;
  updateFeature(moduleCode: string, featureCode: string, isEnabled: boolean): Promise<boolean>;
}
