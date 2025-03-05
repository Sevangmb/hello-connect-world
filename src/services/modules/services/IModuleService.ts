
/**
 * Interface pour le service de modules
 * Suit le principe d'interface segregation de SOLID
 */
import { AppModule, ModuleStatus } from '@/hooks/modules/types';

export interface IModuleService {
  /**
   * Récupère tous les modules
   */
  getAllModules(): Promise<AppModule[]>;
  
  /**
   * Met à jour le statut d'un module
   * @param moduleId ID du module
   * @param status Nouveau statut
   */
  updateModuleStatus(moduleId: string, status: ModuleStatus): Promise<boolean>;
  
  /**
   * Enregistre l'utilisation d'un module
   * @param moduleCode Code du module
   */
  recordModuleUsage(moduleCode: string): Promise<void>;
  
  /**
   * Vérifie si un module est actif
   * @param moduleCode Code du module
   */
  isModuleActive(moduleCode: string): Promise<boolean>;
}
