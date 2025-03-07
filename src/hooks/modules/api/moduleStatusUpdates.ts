
import { moduleApiGateway } from '@/services/api-gateway/ModuleApiGateway';

// Fonction pour mettre à jour le statut d'un module de manière asynchrone
export const updateModuleStatusAsync = async (moduleId: string, status: string) => {
  return await moduleApiGateway.updateModuleStatus(moduleId, status);
};

// Fonction pour mettre à jour le statut d'une fonctionnalité de manière asynchrone
export const updateFeatureStatusAsync = async (featureId: string, isEnabled: boolean) => {
  return await moduleApiGateway.updateFeatureStatus(featureId, isEnabled);
};

// Fonction pour mettre à jour le statut d'une fonctionnalité sans retourner d'erreur
export const updateFeatureStatusSilentAsync = async (featureId: string, isEnabled: boolean) => {
  return await moduleApiGateway.updateFeatureStatusSilent(featureId, isEnabled);
};
