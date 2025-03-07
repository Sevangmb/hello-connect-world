
import { ModuleRepository } from '../repositories/ModuleRepository';
import { FeatureRepository } from '../repositories/FeatureRepository';
import { ModuleFeatureRepository } from '../repositories/ModuleFeatureRepository';
import { ModuleStatsRepository } from '../repositories/ModuleStatsRepository';
import { ModuleDependencyRepository } from '../repositories/ModuleDependencyRepository';
import { ModuleServiceImpl } from '../services/ModuleServiceImpl';
import { IModuleService } from '../domain/interfaces/IModuleService';

// Créer des instances singleton des dépôts
const moduleRepository = new ModuleRepository();
const featureRepository = new FeatureRepository();
const moduleFeatureRepository = new ModuleFeatureRepository();
const moduleStatsRepository = new ModuleStatsRepository();
const moduleDependencyRepository = new ModuleDependencyRepository();

// Créer une instance singleton du service avec les dépôts injectés
const moduleService: IModuleService = new ModuleServiceImpl(
  moduleRepository,
  featureRepository,
  moduleFeatureRepository,
  moduleStatsRepository,
  moduleDependencyRepository
);

/**
 * Obtenir l'instance du service de module avec toutes les dépendances injectées
 */
export const getModuleService = (): IModuleService => {
  return moduleService;
};

/**
 * Obtenir directement les instances de dépôt si nécessaire
 */
export const getModuleRepository = (): ModuleRepository => {
  return moduleRepository;
};

export const getFeatureRepository = (): FeatureRepository => {
  return featureRepository;
};

export const getModuleFeatureRepository = (): ModuleFeatureRepository => {
  return moduleFeatureRepository;
};

export const getModuleStatsRepository = (): ModuleStatsRepository => {
  return moduleStatsRepository;
};

export const getModuleDependencyRepository = (): ModuleDependencyRepository => {
  return moduleDependencyRepository;
};
