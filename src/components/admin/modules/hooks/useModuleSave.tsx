
import { useState, useCallback } from "react";
import { AppModule, ModuleStatus } from "@/hooks/modules/types";
import { useToast } from "@/hooks/use-toast";
import { refreshModulesWithRetry } from "@/hooks/modules/utils/moduleRefresh";

interface UseModuleSaveProps {
  modules: AppModule[];
  updateModuleStatus: (moduleId: string, status: ModuleStatus) => Promise<boolean>;
  updateFeatureStatus: (moduleCode: string, featureCode: string, isEnabled: boolean) => Promise<boolean>;
  refreshModules: () => Promise<AppModule[]>;
  pendingChanges: Record<string, ModuleStatus>;
  resetPendingChanges: () => void;
  onStatusChange?: () => void;
}

export const useModuleSave = ({
  modules,
  updateModuleStatus,
  updateFeatureStatus,
  refreshModules,
  pendingChanges,
  resetPendingChanges,
  onStatusChange
}: UseModuleSaveProps) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fonction pour sauvegarder les changements avec retries
  const saveChanges = useCallback(async () => {
    if (Object.keys(pendingChanges).length === 0) return;
    
    setSaving(true);
    setError(null);
    
    const pendingModuleIds = Object.keys(pendingChanges);
    const maxRetries = 3;
    let successCount = 0;
    let failedModules: string[] = [];
    
    try {
      // Traiter chaque module avec des changements en attente
      for (const moduleId of pendingModuleIds) {
        const newStatus = pendingChanges[moduleId];
        let success = false;
        let retryCount = 0;
        
        // Appliquer une stratégie de backoff exponentiel pour les retries
        while (!success && retryCount < maxRetries) {
          try {
            console.log(`Tentative ${retryCount + 1} de mise à jour du statut pour le module ${moduleId}`);
            success = await updateModuleStatus(moduleId, newStatus);
            if (success) {
              successCount++;
              break;
            }
          } catch (err) {
            console.error(`Erreur lors de la mise à jour du module ${moduleId}:`, err);
          }
          
          retryCount++;
          if (retryCount < maxRetries) {
            // Attendre avec un délai exponentiel entre les tentatives
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
          }
        }
        
        if (!success) {
          console.error(`Échec de la mise à jour du module ${moduleId} après ${maxRetries} tentatives`);
          failedModules.push(moduleId);
        }
      }
      
      if (successCount > 0) {
        // Rafraîchir la liste des modules après les mises à jour
        await refreshModulesWithRetry(modules => modules, 3);
        
        // Réinitialiser les changements en attente
        resetPendingChanges();
        
        // Appeler le callback si fourni
        if (onStatusChange) {
          onStatusChange();
        }
        
        // Afficher une notification de succès
        toast({
          title: "Modifications enregistrées",
          description: `${successCount} module(s) mis à jour avec succès.`,
        });
      }
      
      // Gérer les échecs partiels
      if (failedModules.length > 0) {
        const errorMessage = `Impossible de mettre à jour ${failedModules.length} module(s). Veuillez réessayer.`;
        setError(errorMessage);
        
        toast({
          variant: "destructive",
          title: "Erreur partielle",
          description: errorMessage,
        });
      }
    } catch (err: any) {
      const errorMessage = err.message || "Une erreur s'est produite lors de l'enregistrement des modifications.";
      console.error("Erreur lors de la sauvegarde des modules:", err);
      
      setError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: errorMessage,
      });
    } finally {
      // Forcer un nouveau rafraîchissement après les opérations
      try {
        await refreshModules();
      } catch (refreshErr) {
        console.error("Erreur lors du rafraîchissement final des modules:", refreshErr);
      }
      
      setSaving(false);
    }
  }, [
    pendingChanges, 
    updateModuleStatus, 
    refreshModules, 
    resetPendingChanges, 
    onStatusChange, 
    toast
  ]);

  return { saving, saveChanges, error };
};
