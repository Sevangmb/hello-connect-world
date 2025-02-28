
/**
 * Système de synchronisation entre onglets pour les modules
 * Ce fichier permet de synchroniser les changements de statut des modules entre différents onglets
 */

import { ModuleStatus } from "./types";

// Évènements de broadcast entre onglets (localStorage)
const MODULE_STATUS_CHANGE_EVENT = "module_status_change_broadcast";
const FEATURE_STATUS_CHANGE_EVENT = "feature_status_change_broadcast";

// Interface pour les messages de statut des modules
interface ModuleStatusChangeMessage {
  moduleId: string;
  status: ModuleStatus;
  timestamp: number;
}

// Interface pour les messages de statut des fonctionnalités
interface FeatureStatusChangeMessage {
  moduleCode: string;
  featureCode: string;
  isEnabled: boolean;
  timestamp: number;
}

/**
 * Initialiser la synchronisation entre onglets
 */
export const initTabSync = () => {
  // Ajouter les écouteurs d'événements pour le stockage local
  window.addEventListener("storage", handleStorageEvent);

  // Log pour confirmer l'initialisation
  console.log("Module tab synchronization initialized");
};

/**
 * Nettoyer les écouteurs lors du démontage du composant
 */
export const cleanupTabSync = () => {
  window.removeEventListener("storage", handleStorageEvent);
};

/**
 * Gérer les événements de stockage local pour la synchronisation entre onglets
 */
const handleStorageEvent = (event: StorageEvent) => {
  if (!event.key) return;

  try {
    // Traiter les changements de statut de module
    if (event.key === MODULE_STATUS_CHANGE_EVENT && event.newValue) {
      const data: ModuleStatusChangeMessage = JSON.parse(event.newValue);
      console.log("Received module status change from another tab:", data);
      
      // Déclencher l'événement DOM pour que les composants puissent mettre à jour leur état
      const moduleEvent = new CustomEvent("module_status_changed", {
        detail: data
      });
      window.dispatchEvent(moduleEvent);
    }
    
    // Traiter les changements de statut de fonctionnalité
    if (event.key === FEATURE_STATUS_CHANGE_EVENT && event.newValue) {
      const data: FeatureStatusChangeMessage = JSON.parse(event.newValue);
      console.log("Received feature status change from another tab:", data);
      
      // Déclencher l'événement DOM pour que les composants puissent mettre à jour leur état
      const featureEvent = new CustomEvent("feature_status_changed", {
        detail: data
      });
      window.dispatchEvent(featureEvent);
    }
  } catch (err) {
    console.error("Error handling storage event:", err);
  }
};

/**
 * Diffuser un changement de statut de module à tous les onglets
 * @param moduleId Identifiant du module
 * @param status Nouveau statut du module
 */
export const broadcastModuleStatusChange = (moduleId: string, status: ModuleStatus) => {
  try {
    const message: ModuleStatusChangeMessage = {
      moduleId,
      status,
      timestamp: Date.now()
    };
    
    localStorage.setItem(MODULE_STATUS_CHANGE_EVENT, JSON.stringify(message));
    // Puis supprimer pour permettre de futures mises à jour du même module
    setTimeout(() => {
      localStorage.removeItem(MODULE_STATUS_CHANGE_EVENT);
    }, 100);
    
    console.log("Broadcasting module status change:", message);
  } catch (err) {
    console.error("Error broadcasting module status change:", err);
  }
};

/**
 * Diffuser un changement de statut de fonctionnalité à tous les onglets
 * @param moduleCode Code du module
 * @param featureCode Code de la fonctionnalité
 * @param isEnabled Nouvel état de la fonctionnalité
 */
export const broadcastFeatureStatusChange = (moduleCode: string, featureCode: string, isEnabled: boolean) => {
  try {
    const message: FeatureStatusChangeMessage = {
      moduleCode,
      featureCode,
      isEnabled,
      timestamp: Date.now()
    };
    
    localStorage.setItem(FEATURE_STATUS_CHANGE_EVENT, JSON.stringify(message));
    // Puis supprimer pour permettre de futures mises à jour de la même fonctionnalité
    setTimeout(() => {
      localStorage.removeItem(FEATURE_STATUS_CHANGE_EVENT);
    }, 100);
    
    console.log("Broadcasting feature status change:", message);
  } catch (err) {
    console.error("Error broadcasting feature status change:", err);
  }
};
