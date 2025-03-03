
import { AppModule, ModuleStatus } from "../types";

/**
 * Type pour les métadonnées d'un module enregistré
 */
export interface RegisteredModule {
  code: string;
  name: string;
  description: string;
  dependencies: string[];
  isCore?: boolean;
  features?: string[];
}

/**
 * Registre de modules qui centralise les définitions des modules
 * Cette approche déclarative simplifie la gestion des modules
 */
class ModuleRegistry {
  private modules: Map<string, RegisteredModule> = new Map();
  private moduleStatuses: Map<string, ModuleStatus> = new Map();
  private featureStatuses: Map<string, Map<string, boolean>> = new Map();

  /**
   * Enregistrer un nouveau module dans le registre
   */
  register(module: RegisteredModule): void {
    if (this.modules.has(module.code)) {
      console.warn(`Module ${module.code} est déjà enregistré. Mise à jour des métadonnées.`);
    }
    
    this.modules.set(module.code, module);
    console.log(`Module '${module.name}' (${module.code}) enregistré avec succès`);
  }

  /**
   * Obtenir un module par son code
   */
  getModule(code: string): RegisteredModule | undefined {
    return this.modules.get(code);
  }

  /**
   * Obtenir tous les modules enregistrés
   */
  getAllModules(): RegisteredModule[] {
    return Array.from(this.modules.values());
  }

  /**
   * Mettre à jour le statut d'un module
   */
  setModuleStatus(code: string, status: ModuleStatus): void {
    this.moduleStatuses.set(code, status);
    
    // Si le module est désactivé, désactiver automatiquement les fonctionnalités
    if (status !== 'active') {
      if (this.featureStatuses.has(code)) {
        const features = this.featureStatuses.get(code)!;
        for (const [feature, _] of features.entries()) {
          features.set(feature, false);
        }
      }
    }
  }

  /**
   * Définir le statut d'une fonctionnalité d'un module
   */
  setFeatureStatus(moduleCode: string, featureCode: string, enabled: boolean): void {
    if (!this.featureStatuses.has(moduleCode)) {
      this.featureStatuses.set(moduleCode, new Map());
    }
    
    const features = this.featureStatuses.get(moduleCode)!;
    features.set(featureCode, enabled);
  }

  /**
   * Obtenir le statut d'un module
   */
  getModuleStatus(code: string): ModuleStatus {
    return this.moduleStatuses.get(code) || 'inactive';
  }

  /**
   * Vérifier si un module est actif
   */
  isModuleActive(code: string): boolean {
    // Les modules admin sont toujours actifs
    if (code === 'admin' || code.startsWith('admin_')) {
      return true;
    }
    return this.getModuleStatus(code) === 'active';
  }

  /**
   * Vérifier si une fonctionnalité est activée
   */
  isFeatureEnabled(moduleCode: string, featureCode: string): boolean {
    // Si le module est inactif, la fonctionnalité est désactivée
    if (!this.isModuleActive(moduleCode)) {
      return false;
    }
    
    // Vérifier le statut spécifique de la fonctionnalité
    if (this.featureStatuses.has(moduleCode)) {
      const features = this.featureStatuses.get(moduleCode)!;
      if (features.has(featureCode)) {
        return features.get(featureCode) || false;
      }
    }
    
    // Par défaut, les fonctionnalités ne sont pas activées
    return false;
  }

  /**
   * Charger l'état des modules depuis les données API
   */
  loadFromApiData(modules: AppModule[], features: Record<string, Record<string, boolean>>): void {
    // Charger les statuts des modules
    modules.forEach(module => {
      this.setModuleStatus(module.code, module.status);
      
      // Enregistrer le module s'il n'est pas encore connu
      if (!this.modules.has(module.code)) {
        this.register({
          code: module.code,
          name: module.name,
          description: module.description,
          dependencies: [],
          isCore: module.is_core
        });
      }
    });
    
    // Charger les statuts des fonctionnalités
    Object.entries(features).forEach(([moduleCode, moduleFeatures]) => {
      Object.entries(moduleFeatures).forEach(([featureCode, isEnabled]) => {
        this.setFeatureStatus(moduleCode, featureCode, isEnabled);
      });
    });
    
    console.log(`État chargé pour ${modules.length} modules et ${Object.keys(features).length} modules avec fonctionnalités`);
  }

  /**
   * Synchroniser les changements vers la base de données
   * Cette fonction sera appelée pour persister les changements
   */
  async syncChangesToDb(): Promise<boolean> {
    // Cette méthode sera implémentée pour sauvegarder les changements
    // Pour l'instant, elle retourne true pour simuler une sauvegarde réussie
    return true;
  }
}

// Exporter une instance unique (singleton) du registre
export const moduleRegistry = new ModuleRegistry();

// Fonction utilitaire pour définir un module
export function defineModule(module: RegisteredModule): RegisteredModule {
  moduleRegistry.register(module);
  return module;
}
