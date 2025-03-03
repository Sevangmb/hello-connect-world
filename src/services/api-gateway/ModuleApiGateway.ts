
/**
 * API Gateway pour le Module Service
 * Sert de façade entre les composants UI et le service de modules
 */
import { moduleService } from '@/services/modules/ModuleService';
import { AppModule, ModuleStatus } from '@/hooks/modules/types';
import { BaseApiGateway } from './BaseApiGateway';

/**
 * Classe qui expose une API claire pour interagir avec le service de modules
 * Abstrait la complexité du service sous-jacent et ajoute des fonctionnalités
 * comme la journalisation, la validation, etc.
 */
class ModuleApiGateway extends BaseApiGateway {
  constructor() {
    super('module');
  }

  /**
   * Initialise le service de modules
   * @returns Promise<boolean> True si l'initialisation a réussi
   */
  async initialize(): Promise<boolean> {
    return this.executeOperation('initialize', {}, async () => {
      return await moduleService.initialize();
    });
  }

  /**
   * Récupère la liste des modules
   * @returns Liste des modules
   */
  getModules(): AppModule[] {
    return this.executeSync('getModules', () => {
      return moduleService.getModules();
    });
  }

  /**
   * Rafraîchit la liste des modules
   * @param force Force le rafraîchissement même si des données existent déjà
   * @returns Promise<AppModule[]> Liste des modules rafraîchis
   */
  async refreshModules(force: boolean = false): Promise<AppModule[]> {
    return this.executeOperation('refreshModules', { force }, async () => {
      return await moduleService.refreshModules(force);
    });
  }

  /**
   * Vérifie si un module est actif
   * @param moduleCode Code du module
   * @returns Boolean True si le module est actif
   */
  isModuleActive(moduleCode: string): boolean {
    return this.executeSync('isModuleActive', () => {
      return moduleService.isModuleActive(moduleCode);
    });
  }

  /**
   * Vérifie si un module est en mode dégradé
   * @param moduleCode Code du module
   * @returns Boolean True si le module est en mode dégradé
   */
  isModuleDegraded(moduleCode: string): boolean {
    return this.executeSync('isModuleDegraded', () => {
      return moduleService.isModuleDegraded(moduleCode);
    });
  }

  /**
   * Met à jour le statut d'un module
   * @param moduleId ID du module
   * @param status Nouveau statut
   * @returns Promise<boolean> True si la mise à jour a réussi
   */
  async updateModuleStatus(moduleId: string, status: ModuleStatus): Promise<boolean> {
    return this.executeOperation('updateModuleStatus', { moduleId, status }, async () => {
      return await moduleService.updateModuleStatus(moduleId, status);
    });
  }

  /**
   * Vérifie si une fonctionnalité est activée
   * @param moduleCode Code du module
   * @param featureCode Code de la fonctionnalité
   * @returns Boolean True si la fonctionnalité est activée
   */
  isFeatureEnabled(moduleCode: string, featureCode: string): boolean {
    return this.executeSync('isFeatureEnabled', () => {
      return moduleService.isFeatureEnabled(moduleCode, featureCode);
    });
  }

  /**
   * Met à jour le statut d'une fonctionnalité
   * @param moduleCode Code du module
   * @param featureCode Code de la fonctionnalité
   * @param isEnabled Nouveau statut
   * @returns Promise<boolean> True si la mise à jour a réussi
   */
  async updateFeatureStatus(moduleCode: string, featureCode: string, isEnabled: boolean): Promise<boolean> {
    return this.executeOperation('updateFeatureStatus', { moduleCode, featureCode, isEnabled }, async () => {
      return await moduleService.updateFeatureStatus(moduleCode, featureCode, isEnabled);
    });
  }
}

// Exporter une instance unique pour toute l'application
export const moduleApiGateway = new ModuleApiGateway();
