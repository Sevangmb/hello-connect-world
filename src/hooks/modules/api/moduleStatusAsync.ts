
import { ModuleStatus } from "../types";
import { moduleApiGateway } from "@/services/api-gateway/ModuleApiGateway";

/**
 * Récupère le statut d'un module de manière asynchrone
 * @param moduleCode Code du module
 */
export const getModuleStatusAsync = async (moduleCode: string): Promise<ModuleStatus | null> => {
  try {
    return await moduleApiGateway.getModuleStatus(moduleCode);
  } catch (error) {
    console.error(`Erreur lors de la récupération du statut du module ${moduleCode}:`, error);
    return null;
  }
};
