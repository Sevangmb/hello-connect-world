
import { useState } from "react";
import { ModuleStatus } from "@/hooks/modules/types";

export const useModuleToggle = () => {
  const [pendingChanges, setPendingChanges] = useState<Record<string, ModuleStatus>>({});
  
  // Gérer le changement de statut d'un module (temporaire jusqu'à la sauvegarde)
  const handleToggleModule = (moduleId: string, currentStatus: ModuleStatus) => {
    setPendingChanges(prev => {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      return { ...prev, [moduleId]: newStatus };
    });
  };

  // Vérifier si un module a des changements en attente
  const getModuleStatus = (moduleId: string, currentStatus: ModuleStatus) => {
    return pendingChanges[moduleId] !== undefined ? pendingChanges[moduleId] : currentStatus;
  };
  
  // Vérifier s'il y a des changements en attente
  const hasPendingChanges = Object.keys(pendingChanges).length > 0;
  
  // Réinitialiser les changements en attente
  const resetPendingChanges = () => {
    setPendingChanges({});
  };

  return {
    pendingChanges,
    handleToggleModule,
    getModuleStatus,
    hasPendingChanges,
    resetPendingChanges
  };
};
