
// Fichier refactorisé pour servir uniquement d'agrégateur

// Re-export de toutes les fonctionnalités depuis les fichiers spécialisés
export {
  getModuleActiveStatus,
  getModuleDegradedStatus,
  getFeatureEnabledStatus,
  preloadModuleStatuses,
  updateModuleCache
} from './status';
