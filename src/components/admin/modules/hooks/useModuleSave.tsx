
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
      
      // Préparer les mises à jour pour l'opération par lot
      const updates = Object.entries(pendingChanges).map(([moduleId, newStatus]) => ({
        id: moduleId,
        status: newStatus,
        updated_at: new Date().toISOString()
      }));
      
      // Mise à jour par lots pour de meilleures performances
      if (updates.length > 0) {
        // Utiliser l'API UPSERT de Supabase pour mettre à jour plusieurs lignes en une seule opération
        const { error } = await supabase
          .from("app_modules")
          .upsert(updates, { 
            onConflict: 'id',
            ignoreDuplicates: false
          });
          
        if (error) throw error;
        
        // Notification unique pour toutes les mises à jour
        toast({
          title: "Modules mis à jour",
          description: `${updates.length} modules ont été mis à jour avec succès`,
        });
      }
      
      // Purger les caches pour forcer un rechargement
      purgeModuleCaches();
      
      // Déclencher l'événement personnalisé pour les mises à jour des modules
      triggerModuleStatusChanged();
      
      // Réinitialiser les changements en attente
      resetPendingChanges();
      
      toast({
        title: "Modifications enregistrées",
        description: "Les modules ont été mis à jour avec succès",
      });
      
      // Rafraîchir les données après un court délai
      setTimeout(async () => {
        await refreshModules();
        
        // Notifier le parent que les statuts ont changé
        if (onStatusChange) {
          onStatusChange();
        }
      }, 500);
      
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
