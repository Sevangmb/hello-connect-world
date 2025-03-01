
/**
 * Point d'entrée pour le système de modules
 * Exporte toutes les fonctionnalités publiques
 */

export * from './useModules';
export * from './types';
export * from './constants';
export * from './ModuleApiContext';

// Re-exporter uniquement ce qui est nécessaire pour les interfaces publiques
// Les autres fichiers sont considérés comme internes à l'implémentation
