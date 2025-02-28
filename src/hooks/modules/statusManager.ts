
/**
 * Gestionnaire de statut des modules
 * Ce fichier centralise les fonctions de mise à jour des statuts de modules et fonctionnalités
 */

import { AppModule, ModuleStatus } from "./types";
import { triggerModuleStatusChanged, triggerFeatureStatusChanged } from "./events";

export const useStatusManager = () => {
  /**
   * Mettre à jour le statut d'un module
   * @param moduleId Identifiant du module
   * @param status Nouveau statut du module
   * @param modules Liste des modules actuels
   * @param setModules Fonction pour mettre à jour la liste des modules
   */
  const updateModuleStatus = async (
    moduleId: string,
    status: ModuleStatus,
    modules: AppModule[],
    setModules: React.Dispatch<React.SetStateAction<AppModule[]>>
  ) => {
    try {
      // Mettre à jour localement
      const updatedModules = modules.map(module => {
        if (module.id === moduleId) {
          return { ...module, status };
        }
        return module;
      });

      // Mettre à jour l'état
      setModules(updatedModules);
      
      // Déclencher l'événement
      triggerModuleStatusChanged();
      
      return true;
    } catch (err) {
      console.error("Erreur lors de la mise à jour du statut du module:", err);
      return false;
    }
  };

  /**
   * Mettre à jour l'état d'une fonctionnalité (silencieusement, sans notifications)
   * @param moduleCode Code du module
   * @param featureCode Code de la fonctionnalité
   * @param isEnabled Nouvel état de la fonctionnalité
   * @param setModules Fonction pour mettre à jour la liste des modules
   */
  const updateFeatureStatusSilent = async (
    moduleCode: string,
    featureCode: string,
    isEnabled: boolean,
    setModules: React.Dispatch<React.SetStateAction<AppModule[]>>
  ) => {
    try {
      // Mettre à jour localement dans les modules
      setModules(prevModules => 
        prevModules.map(module => {
          if (module.code === moduleCode) {
            return {
              ...module,
              features: {
                ...(module.features || {}),
                [featureCode]: isEnabled
              }
            };
          }
          return module;
        })
      );
      
      return true;
    } catch (err) {
      console.error("Erreur lors de la mise à jour silencieuse de la fonctionnalité:", err);
      return false;
    }
  };
  
  /**
   * Mettre à jour l'état d'une fonctionnalité avec notification
   * @param moduleCode Code du module
   * @param featureCode Code de la fonctionnalité
   * @param isEnabled Nouvel état de la fonctionnalité
   * @param setModules Fonction pour mettre à jour la liste des modules
   * @param setFeatures Fonction pour mettre à jour les features (optionnelle)
   */
  const updateFeatureStatus = async (
    moduleCode: string,
    featureCode: string,
    isEnabled: boolean,
    setModules: React.Dispatch<React.SetStateAction<AppModule[]>>,
    setFeatures?: React.Dispatch<React.SetStateAction<Record<string, Record<string, boolean>>>>
  ) => {
    try {
      // Mettre à jour localement dans les modules
      setModules(prevModules => 
        prevModules.map(module => {
          if (module.code === moduleCode) {
            return {
              ...module,
              features: {
                ...(module.features || {}),
                [featureCode]: isEnabled
              }
            };
          }
          return module;
        })
      );
      
      // Mettre à jour les features dans l'état si disponible
      if (setFeatures) {
        setFeatures(prevFeatures => {
          const newFeatures = { ...prevFeatures };
          if (!newFeatures[moduleCode]) {
            newFeatures[moduleCode] = {};
          }
          newFeatures[moduleCode][featureCode] = isEnabled;
          return newFeatures;
        });
      }
      
      // Déclencher l'événement
      triggerFeatureStatusChanged();
      
      return true;
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la fonctionnalité:", err);
      return false;
    }
  };
  
  return {
    updateModuleStatus,
    updateFeatureStatus,
    updateFeatureStatusSilent
  };
};
