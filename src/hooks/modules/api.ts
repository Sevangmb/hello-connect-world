
// Exporte toutes les fonctions liées à l'API des modules

// Imports depuis moduleStatusCore
import {
  isModuleActive,
  isModuleDegraded,
  isModuleInactive,
  isModuleMaintenance,
  isAdminModule
} from './api/moduleStatusCore';

// Imports depuis moduleStatusAsync
import {
  getModuleStatusAsync,
  checkModuleActiveAsync,
  checkModuleDegradedAsync,
  checkFeatureEnabledAsync,
  fetchModuleActiveState
} from './api/moduleStatusAsync';

// Imports depuis moduleStatusUpdates
import {
  updateModuleStatusAsync,
  updateFeatureStatusAsync,
  updateFeatureStatusSilentAsync
} from './api/moduleStatusUpdates';

// Re-exporter toutes les fonctions
export {
  // Fonctions synchrones
  isModuleActive,
  isModuleDegraded,
  isModuleInactive,
  isModuleMaintenance,
  isAdminModule,
  
  // Fonctions asynchrones de vérification
  getModuleStatusAsync,
  checkModuleActiveAsync,
  checkModuleDegradedAsync,
  checkFeatureEnabledAsync,
  fetchModuleActiveState,
  
  // Fonctions asynchrones de mise à jour
  updateModuleStatusAsync,
  updateFeatureStatusAsync,
  updateFeatureStatusSilentAsync
};
