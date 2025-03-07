
import { moduleApiGateway } from '@/services/api-gateway/ModuleApiGateway';

// Import les fonctions de gestion de statut des modules
import { 
  getModuleStatusAsync, 
  checkModuleActiveAsync, 
  checkModuleDegradedAsync,
  checkFeatureEnabledAsync,
  fetchModuleActiveState
} from './api/moduleStatusAsync';

// Import les fonctions de mise à jour de statut
import {
  updateModuleStatusAsync,
  updateFeatureStatusAsync,
  updateFeatureStatusSilentAsync
} from './api/moduleStatusUpdates';

// Export l'API des modules
export {
  // Fonctions de statut
  getModuleStatusAsync,
  checkModuleActiveAsync,
  checkModuleDegradedAsync,
  checkFeatureEnabledAsync,
  fetchModuleActiveState,
  
  // Fonctions de mise à jour
  updateModuleStatusAsync,
  updateFeatureStatusAsync,
  updateFeatureStatusSilentAsync,
  
  // Instance de l'API Gateway
  moduleApiGateway
};
