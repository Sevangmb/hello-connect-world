
import { moduleApiGateway } from '@/services/api-gateway/ModuleApiGateway';

// Fonction pour obtenir le statut d'un module de manière asynchrone
export const getModuleStatusAsync = async (moduleCode: string) => {
  return await moduleApiGateway.getModuleStatus(moduleCode);
};

// Fonction pour vérifier si un module est actif
export const checkModuleActiveAsync = async (moduleCode: string) => {
  const status = await getModuleStatusAsync(moduleCode);
  return status === 'active';
};

// Fonction pour vérifier si un module est en mode dégradé
export const checkModuleDegradedAsync = async (moduleCode: string) => {
  const status = await getModuleStatusAsync(moduleCode);
  return status === 'degraded';
};

// Fonction pour vérifier si une fonctionnalité est activée
export const checkFeatureEnabledAsync = async (featureCode: string, moduleCode: string) => {
  // Cette implémentation est simplifiée
  return true;
};

// Fonction pour récupérer l'état actif d'un module
export const fetchModuleActiveState = async (moduleCode: string) => {
  return await checkModuleActiveAsync(moduleCode);
};
