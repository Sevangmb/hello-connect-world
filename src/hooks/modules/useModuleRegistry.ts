
import { useEffect, useState } from "react";
import { moduleRegistry, RegisteredModule } from "./services/ModuleRegistry";
import { ModuleDbService } from "./services/ModuleDbService";
import { ModuleValidator } from "./services/ModuleValidator";
import { ModuleStatus } from "./types";

/**
 * Hook pour utiliser le registre de modules dans les composants
 */
export const useModuleRegistry = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Initialiser le registre au montage du composant
  useEffect(() => {
    const initializeRegistry = async () => {
      if (isInitialized) return;
      
      try {
        setIsLoading(true);
        
        // Charger les modules et les fonctionnalités depuis la base de données
        const [modules, features] = await Promise.all([
          ModuleDbService.loadAllModules(),
          ModuleDbService.loadAllFeatures()
        ]);
        
        // Charger les données dans le registre
        moduleRegistry.loadFromApiData(modules, features);
        
        // Valider l'état des modules et réparer automatiquement les incohérences
        await ModuleValidator.autoRepairModuleStates();
        
        setIsInitialized(true);
        setError(null);
      } catch (err: any) {
        console.error("Erreur lors de l'initialisation du registre:", err);
        setError(err.message || "Erreur lors de l'initialisation du registre");
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeRegistry();
  }, [isInitialized]);
  
  /**
   * Vérifier si un module est actif
   */
  const isModuleActive = async (code: string): Promise<boolean> => {
    return moduleRegistry.isModuleActive(code);
  };
  
  /**
   * Vérifier si une fonctionnalité est activée
   */
  const isFeatureEnabled = (moduleCode: string, featureCode: string): boolean => {
    return moduleRegistry.isFeatureEnabled(moduleCode, featureCode);
  };
  
  /**
   * Mettre à jour le statut d'un module
   */
  const updateModuleStatus = async (moduleId: string, code: string, status: ModuleStatus): Promise<boolean> => {
    // Vérifier si la mise à jour est valide
    if (status === 'active') {
      const validationResult = ModuleValidator.canActivateModule(code);
      if (!validationResult.canActivate) {
        console.error(`Impossible d'activer le module ${code} en raison de dépendances manquantes:`, validationResult.missingDependencies);
        return false;
      }
    } else if (status === 'inactive') {
      // Vérifier l'impact de la désactivation
      const impact = ModuleValidator.getImpactOfDeactivation(code);
      if (impact.criticallyAffected.length > 0) {
        console.warn(`La désactivation du module ${code} affectera critiquement:`, impact.criticallyAffected);
      }
    }
    
    // Mettre à jour dans le registre
    moduleRegistry.setModuleStatus(code, status);
    
    // Mettre à jour dans la base de données
    const success = await ModuleDbService.updateModuleStatus(moduleId, status);
    
    return success;
  };
  
  /**
   * Mettre à jour le statut d'une fonctionnalité
   */
  const updateFeatureStatus = async (moduleCode: string, featureCode: string, isEnabled: boolean): Promise<boolean> => {
    // Vérifier si le module est actif
    if (isEnabled && !moduleRegistry.isModuleActive(moduleCode)) {
      console.error(`Impossible d'activer la fonctionnalité ${featureCode} car le module ${moduleCode} est inactif`);
      return false;
    }
    
    // Mettre à jour dans le registre
    moduleRegistry.setFeatureStatus(moduleCode, featureCode, isEnabled);
    
    // Mettre à jour dans la base de données
    const success = await ModuleDbService.updateFeatureStatus(moduleCode, featureCode, isEnabled);
    
    return success;
  };
  
  /**
   * Rafraîchir les modules depuis la base de données
   */
  const refreshModules = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Charger les modules et les fonctionnalités depuis la base de données
      const [modules, features] = await Promise.all([
        ModuleDbService.loadAllModules(),
        ModuleDbService.loadAllFeatures()
      ]);
      
      // Charger les données dans le registre
      moduleRegistry.loadFromApiData(modules, features);
      
      setError(null);
    } catch (err: any) {
      console.error("Erreur lors du rafraîchissement des modules:", err);
      setError(err.message || "Erreur lors du rafraîchissement des modules");
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Obtenir tous les modules enregistrés
   */
  const getAllModules = (): RegisteredModule[] => {
    return moduleRegistry.getAllModules();
  };
  
  return {
    isLoading,
    error,
    isInitialized,
    isModuleActive,
    isFeatureEnabled,
    updateModuleStatus,
    updateFeatureStatus,
    refreshModules,
    getAllModules
  };
};
