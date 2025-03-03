
import { moduleRegistry } from "./ModuleRegistry";
import { ModuleStatus } from "../types";

/**
 * Service responsable de la validation des dépendances et de l'intégrité des modules
 */
export class ModuleValidator {
  /**
   * Vérifier si un module peut être activé en fonction de ses dépendances
   */
  static canActivateModule(moduleCode: string): { canActivate: boolean; missingDependencies: string[] } {
    const module = moduleRegistry.getModule(moduleCode);
    if (!module) {
      return { canActivate: false, missingDependencies: [] };
    }
    
    const missingDependencies: string[] = [];
    
    // Vérifier chaque dépendance
    for (const depCode of module.dependencies) {
      if (!moduleRegistry.isModuleActive(depCode)) {
        missingDependencies.push(depCode);
      }
    }
    
    return {
      canActivate: missingDependencies.length === 0,
      missingDependencies
    };
  }
  
  /**
   * Vérifier l'impact sur les autres modules si un module est désactivé
   */
  static getImpactOfDeactivation(moduleCode: string): { 
    affectedModules: string[]; 
    criticallyAffected: string[] 
  } {
    const affectedModules: string[] = [];
    const criticallyAffected: string[] = [];
    
    // Vérifier tous les modules qui pourraient être affectés
    moduleRegistry.getAllModules().forEach(module => {
      if (module.dependencies.includes(moduleCode)) {
        affectedModules.push(module.code);
        
        // Si c'est une dépendance critique, ajouter à la liste des modules critiquement affectés
        const validationResult = this.canActivateModule(module.code);
        if (!validationResult.canActivate) {
          criticallyAffected.push(module.code);
        }
      }
    });
    
    return { affectedModules, criticallyAffected };
  }
  
  /**
   * Vérifier la validité de l'état des modules
   */
  static validateModuleStates(): Map<string, { 
    status: ModuleStatus; 
    isValid: boolean; 
    issues: string[] 
  }> {
    const results = new Map<string, { 
      status: ModuleStatus; 
      isValid: boolean; 
      issues: string[] 
    }>();
    
    moduleRegistry.getAllModules().forEach(module => {
      const currentStatus = moduleRegistry.getModuleStatus(module.code);
      const issues: string[] = [];
      
      // Vérifier la validité de l'état actuel
      if (currentStatus === 'active') {
        const validationResult = this.canActivateModule(module.code);
        if (!validationResult.canActivate) {
          issues.push(`Le module a des dépendances manquantes: ${validationResult.missingDependencies.join(', ')}`);
        }
      }
      
      results.set(module.code, {
        status: currentStatus,
        isValid: issues.length === 0,
        issues
      });
    });
    
    return results;
  }
  
  /**
   * Réparer automatiquement les états invalides des modules
   */
  static async autoRepairModuleStates(): Promise<boolean> {
    let changes = false;
    const validationResults = this.validateModuleStates();
    
    for (const [moduleCode, result] of validationResults.entries()) {
      if (!result.isValid && result.status === 'active') {
        // Désactiver les modules avec des états invalides
        moduleRegistry.setModuleStatus(moduleCode, 'inactive');
        changes = true;
      }
    }
    
    // Si des changements ont été effectués, synchroniser avec la base de données
    if (changes) {
      await moduleRegistry.syncChangesToDb();
    }
    
    return changes;
  }
}
