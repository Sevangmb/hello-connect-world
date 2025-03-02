
// Fichier refactorisé pour servir uniquement d'agrégateur

// Re-export de toutes les fonctionnalités depuis les fichiers spécialisés
export {
  isModuleActiveAsync,
  isModuleDegradedAsync,
  isFeatureEnabledAsync,
  refreshModulesData,
  refreshFeaturesData,
  updateModuleStatusData,
  updateFeatureStatusData
} from './queries';
