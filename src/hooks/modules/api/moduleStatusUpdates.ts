
import { ModuleStatus } from "../types";
import { moduleApiGateway } from "@/services/api-gateway/ModuleApiGateway";

/**
 * Met à jour le statut d'un module
 * @param moduleId ID du module
 * @param status Nouveau statut
 */
export const updateModuleStatusAsync = async (moduleId: string, status: ModuleStatus): Promise<boolean> => {
  try {
    return await moduleApiGateway.updateModuleStatus(moduleId, status);
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du statut du module ${moduleId}:`, error);
    return false;
  }
};

/**
 * Met à jour le statut d'une fonctionnalité de module
 * @param moduleCode Code du module
 * @param featureCode Code de la fonctionnalité
 * @param isEnabled État d'activation
 */
export const updateFeatureStatusAsync = async (moduleCode: string, featureCode: string, isEnabled: boolean): Promise<boolean> => {
  try {
    return await moduleApiGateway.updateFeatureStatus(moduleCode, featureCode, isEnabled);
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de la fonctionnalité ${featureCode} du module ${moduleCode}:`, error);
    return false;
  }
};

/**
 * Met à jour silencieusement le statut d'une fonctionnalité de module
 * @param moduleCode Code du module
 * @param featureCode Code de la fonctionnalité
 * @param isEnabled État d'activation
 */
export const updateFeatureStatusSilentAsync = async (moduleCode: string, featureCode: string, isEnabled: boolean): Promise<boolean> => {
  try {
    return await moduleApiGateway.updateFeatureStatus(moduleCode, featureCode, isEnabled);
  } catch (error) {
    console.error(`Erreur lors de la mise à jour silencieuse de la fonctionnalité ${featureCode} du module ${moduleCode}:`, error);
    return false;
  }
};
