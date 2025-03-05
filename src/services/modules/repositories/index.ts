
import { ModuleRepository } from './ModuleRepository';
import { DependencyRepository } from './DependencyRepository';
import { FeatureRepository } from './FeatureRepository';

// Create and export instances
export const moduleRepository = new ModuleRepository();
export const dependencyRepository = new DependencyRepository();
export const featureRepository = new FeatureRepository();
