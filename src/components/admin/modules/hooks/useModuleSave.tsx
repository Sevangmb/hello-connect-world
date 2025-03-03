
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
  const { toast } = useToast();

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
      
      // Tableau pour stocker les résultats des mises à jour
      const updateResults = [];
      
      // Effectuer chaque mise à jour individuellement
      for (const [moduleId, newStatus] of Object.entries(pendingChanges)) {
        // Rechercher le module complet dans la liste des modules
        const moduleToUpdate = modules.find(m => m.id === moduleId);
        
        if (moduleToUpdate) {
          try {
            // Mettre à jour directement dans Supabase pour éviter les erreurs de connexion
            const { error } = await supabase
              .from('app_modules')
              .update({ 
                status: newStatus, 
                updated_at: new Date().toISOString() 
              })
              .eq('id', moduleId);
              
            if (error) {
              console.error(`Erreur lors de la mise à jour du module ${moduleId}:`, error);
              continue;
            }
            
            // Ajouter le module mis à jour aux résultats
            updateResults.push({
              id: moduleId,
              code: moduleToUpdate.code,
              status: newStatus
            });
          } catch (error) {
            console.error(`Exception lors de la mise à jour du module ${moduleId}:`, error);
          }
        }
      }
      
      // Notification unique pour toutes les mises à jour
      if (updateResults.length > 0) {
        toast({
          title: "Modules mis à jour",
          description: `${updateResults.length} modules ont été mis à jour avec succès`,
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
          }
        }, 500);
      } else {
        toast({
          variant: "destructive",
          title: "Échec de la mise à jour",
          description: "Aucun module n'a pu être mis à jour. Vérifiez votre connexion internet.",
        });
      }
    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde des modifications:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'enregistrer les modifications: " + error.message,
      });
    } finally {
      setSaving(false);
    }
  }, [pendingChanges, resetPendingChanges, refreshModules, onStatusChange, toast, modules]);

  return {
    saving,
    saveChanges
  };
};
