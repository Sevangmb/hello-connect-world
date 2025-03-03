
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { ModuleStatus, AppModule } from "@/hooks/modules/types";
import { supabase } from "@/integrations/supabase/client";
import { triggerModuleStatusChanged } from "@/hooks/modules/events";
import { purgeModuleCaches } from "@/hooks/modules/api/moduleStatusCore";

interface UseModuleSaveProps {
  modules: AppModule[];
  updateModuleStatus: (moduleId: string, newStatus: ModuleStatus) => Promise<boolean>;
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

  // Fonction pour gérer une tentative unique de mise à jour
  const attemptUpdateModule = async (moduleId: string, newStatus: ModuleStatus, retryCount = 0): Promise<boolean> => {
    try {
      console.log(`Tentative #${retryCount + 1} de mise à jour du module ${moduleId} au statut ${newStatus}`);
      
      const { error } = await supabase
        .from('app_modules')
        .update({ 
          status: newStatus, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', moduleId);
        
      if (error) {
        console.error(`Erreur lors de la mise à jour du module ${moduleId}:`, error);
        throw error;
      }
      
      console.log(`Module ${moduleId} mis à jour avec succès`);
      return true;
    } catch (error) {
      console.error(`Exception lors de la mise à jour du module ${moduleId} (tentative #${retryCount + 1}):`, error);
      
      // Retenter l'opération si nous n'avons pas atteint le nombre max de tentatives
      if (retryCount < 3) {
        // Attendre un délai croissant avant de réessayer
        const delay = (retryCount + 1) * 500; 
        console.log(`Nouvelle tentative dans ${delay}ms...`);
        
        return new Promise((resolve) => {
          setTimeout(async () => {
            const result = await attemptUpdateModule(moduleId, newStatus, retryCount + 1);
            resolve(result);
          }, delay);
        });
      }
      
      return false;
    }
  };

  // Enregistrer tous les changements en lot pour de meilleures performances
  const saveChanges = useCallback(async () => {
    if (Object.keys(pendingChanges).length === 0) {
      toast({
        title: "Aucun changement",
        description: "Il n'y a aucun changement à enregistrer",
      });
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // Tableau pour stocker les résultats des mises à jour
      const updateResults: { id: string; code: string; status: ModuleStatus; success: boolean }[] = [];
      const failedModules: string[] = [];
      
      // Effectuer chaque mise à jour individuellement avec retry
      for (const [moduleId, newStatus] of Object.entries(pendingChanges)) {
        // Rechercher le module complet dans la liste des modules
        const moduleToUpdate = modules.find(m => m.id === moduleId);
        
        if (moduleToUpdate) {
          try {
            // Utiliser la fonction avec retry
            const success = await attemptUpdateModule(moduleId, newStatus);
            
            // Ajouter le module mis à jour aux résultats
            updateResults.push({
              id: moduleId,
              code: moduleToUpdate.code,
              status: newStatus,
              success
            });
            
            if (!success) {
              failedModules.push(moduleToUpdate.name || moduleToUpdate.code);
            }
          } catch (error) {
            console.error(`Exception non gérée lors de la mise à jour du module ${moduleId}:`, error);
            failedModules.push(moduleToUpdate.name || moduleToUpdate.code);
          }
        }
      }
      
      // Compter les réussites
      const successCount = updateResults.filter(r => r.success).length;
      
      // Notification unique pour toutes les mises à jour
      if (successCount > 0) {
        toast({
          title: "Modules mis à jour",
          description: `${successCount} module${successCount > 1 ? 's' : ''} mis à jour avec succès.`,
        });
        
        // Purger les caches pour forcer un rechargement
        purgeModuleCaches();
        
        // Déclencher l'événement personnalisé pour les mises à jour des modules
        triggerModuleStatusChanged();
        
        // Réinitialiser les changements en attente
        resetPendingChanges();
        
        // Rafraîchir les données après un court délai
        setTimeout(async () => {
          try {
            await refreshModules();
            
            // Notifier le parent que les statuts ont changé
            if (onStatusChange) {
              onStatusChange();
            }
          } catch (error) {
            console.error("Erreur lors du rafraîchissement des modules après sauvegarde:", error);
            toast({
              variant: "destructive",
              title: "Erreur de rafraîchissement",
              description: "Les données ont été enregistrées mais leur affichage n'a pas pu être mis à jour.",
            });
          }
        }, 500);
      } else {
        // Si aucune mise à jour n'a réussi
        const errorMessage = failedModules.length > 0 
          ? `Échec de la mise à jour pour les modules : ${failedModules.join(', ')}.` 
          : "Aucun module n'a pu être mis à jour.";
        
        setError(errorMessage);
        
        toast({
          variant: "destructive",
          title: "Échec de la mise à jour",
          description: errorMessage + " Vérifiez votre connexion internet et réessayez.",
        });
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Une erreur inconnue s'est produite";
      console.error("Erreur lors de la sauvegarde des modifications:", error);
      
      setError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'enregistrer les modifications: " + errorMessage,
      });
    } finally {
      setSaving(false);
    }
  }, [pendingChanges, resetPendingChanges, refreshModules, onStatusChange, toast, modules]);

  return {
    saving,
    saveChanges,
    error
  };
};
