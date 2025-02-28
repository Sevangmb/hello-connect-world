
import { ModuleStatus, AppModule } from "./types";
import { 
  updateModuleStatus as updateModuleStatusApi,
  updateFeatureStatus as updateFeatureStatusApi,
  fetchFeatureFlags as fetchFeatureFlagsApi
} from "./api";
import { 
  cacheModuleStatuses,
  combineModulesWithFeatures 
} from "./utils";
import { 
  triggerModuleStatusChanged, 
  triggerFeatureStatusChanged 
} from "./events";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook pour gérer les statuts des modules et fonctionnalités
 */
export const useStatusManager = () => {
  const { toast } = useToast();

  /**
   * Mettre à jour le statut d'un module
   */
  const updateModuleStatus = async (
    moduleId: string, 
    status: ModuleStatus, 
    modules: AppModule[],
    setModules: React.Dispatch<React.SetStateAction<AppModule[]>>
  ) => {
    try {
      await updateModuleStatusApi(moduleId, status);

      // Mettre à jour le statut local pour une réponse plus rapide de l'UI
      setModules(prevModules => {
        const updatedModules = prevModules.map(module => 
          module.id === moduleId ? { ...module, status } : module
        );
        
        // Mettre à jour le cache
        cacheModuleStatuses(updatedModules);
        
        return updatedModules;
      });

      toast({
        title: "Module mis à jour",
        description: "Le statut du module a été modifié avec succès",
      });

      // Si le module est désactivé, désactiver automatiquement toutes ses fonctionnalités
      if (status === 'inactive') {
        const module = modules.find(m => m.id === moduleId);
        if (module && module.features) {
          Object.keys(module.features).forEach(featureCode => {
            // Désactiver chaque fonctionnalité silencieusement (sans toast)
            updateFeatureStatusSilent(module.code, featureCode, false, setModules);
          });
        }
      }
      
      // Déclencher une mise à jour immédiate pour tous les composants qui utilisent ModuleGuard
      triggerModuleStatusChanged();
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du module:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut du module",
      });
    }
  };

  /**
   * Mettre à jour l'état d'une fonctionnalité sans toast de confirmation
   */
  const updateFeatureStatusSilent = async (
    moduleCode: string, 
    featureCode: string, 
    isEnabled: boolean,
    setModules: React.Dispatch<React.SetStateAction<AppModule[]>>
  ) => {
    try {
      await updateFeatureStatusApi(moduleCode, featureCode, isEnabled);

      // Mettre à jour les modules avec les nouvelles valeurs
      setModules(prevModules => {
        return prevModules.map(module => {
          if (module.code === moduleCode && module.features) {
            return {
              ...module,
              features: {
                ...module.features,
                [featureCode]: isEnabled
              }
            };
          }
          return module;
        });
      });
      
      // Déclencher une mise à jour
      triggerFeatureStatusChanged();
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour silencieuse de la fonctionnalité:", error);
    }
  };
  
  /**
   * Mettre à jour l'état d'une fonctionnalité avec notification
   */
  const updateFeatureStatus = async (
    moduleCode: string, 
    featureCode: string, 
    isEnabled: boolean,
    setModules: React.Dispatch<React.SetStateAction<AppModule[]>>,
    setFeatures: React.Dispatch<React.SetStateAction<Record<string, Record<string, boolean>>>>
  ) => {
    try {
      await updateFeatureStatusApi(moduleCode, featureCode, isEnabled);

      toast({
        title: "Fonctionnalité mise à jour",
        description: `La fonctionnalité "${featureCode}" a été ${isEnabled ? 'activée' : 'désactivée'} avec succès`,
      });

      // Rafraîchir les feature flags
      const updatedFeatures = await fetchFeatureFlagsApi();
      setFeatures(updatedFeatures);
      
      // Mettre à jour les modules avec les nouvelles valeurs de feature flags
      setModules(prevModules => 
        combineModulesWithFeatures(prevModules, updatedFeatures)
      );
      
      // Déclencher une mise à jour immédiate
      triggerFeatureStatusChanged();
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour de la fonctionnalité:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la fonctionnalité",
      });
    }
  };

  return {
    updateModuleStatus,
    updateFeatureStatus,
    updateFeatureStatusSilent
  };
};
