
import { ModuleRepository } from '../repositories/ModuleRepository';
import { FeatureRepository } from '../repositories/FeatureRepository';
import { ModuleFeatureRepository } from '../repositories/ModuleFeatureRepository';
import { ModuleStatsRepository } from '../repositories/ModuleStatsRepository';
import { ModuleDependencyRepository } from '../repositories/ModuleDependencyRepository';
import { ModuleServiceImpl } from '../services/ModuleServiceImpl';
import { IModuleService } from '../domain/interfaces/IModuleService';

// Create singleton instances of repositories
const moduleRepository = new ModuleRepository();
const featureRepository = new FeatureRepository();
const moduleFeatureRepository = new ModuleFeatureRepository();
const moduleStatsRepository = new ModuleStatsRepository();
const moduleDependencyRepository = new ModuleDependencyRepository();

// Create a singleton instance of the service with injected repositories
const moduleService: IModuleService = new ModuleServiceImpl(
  moduleRepository,
  featureRepository,
  moduleFeatureRepository,
  moduleStatsRepository,
  moduleDependencyRepository
);

/**
 * Get the module service instance with all dependencies injected
 */
export const getModuleService = (): IModuleService => {
  return moduleService;
};

/**
 * Get repository instances directly if needed
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
