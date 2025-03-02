
// Export des fonctions de vérification synchrone des modules
export { 
  getModuleActiveStatus,
  getModuleDegradedStatus
} from './moduleSyncStatus';

// Export des fonctions de vérification des fonctionnalités
export {
  getFeatureEnabledStatus
} from './featureStatus';

// Export des fonctions de préchargement
export {
  preloadModuleStatuses,
  updateModuleCache
} from './modulePreload';
