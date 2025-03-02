
import { AppModule, ModuleStatus } from '../../types';
import { 
  checkModuleActiveAsync, 
  checkModuleDegradedAsync, 
  checkFeatureEnabledAsync 
} from '../../api/moduleStatusAsync';

/**
 * Vérifie si un module est actif de manière asynchrone
 */
export const isModuleActiveAsync = async (moduleCode: string): Promise<boolean> => {
  return checkModuleActiveAsync(moduleCode);
};

/**
 * Vérifie si un module est en mode dégradé de manière asynchrone
 */
export const isModuleDegradedAsync = async (moduleCode: string): Promise<boolean> => {
  return checkModuleDegradedAsync(moduleCode);
};

/**
 * Vérifie si une fonctionnalité est activée de manière asynchrone
 */
export const isFeatureEnabledAsync = async (
  moduleCode: string, 
  featureCode: string, 
  isModuleActive: (moduleCode: string) => Promise<boolean>
): Promise<boolean> => {
  return checkFeatureEnabledAsync(moduleCode, featureCode, isModuleActive);
};
