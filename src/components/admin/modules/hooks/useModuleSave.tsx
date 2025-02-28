
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ModuleStatus, AppModule } from "@/hooks/modules/types";
import { supabase } from "@/integrations/supabase/client";
import { triggerModuleStatusChanged } from "@/hooks/modules/events";

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

  // Enregistrer tous les changements
  const saveChanges = async () => {
    try {
      setSaving(true);
      
      // Utiliser un appel direct à la base de données
      const updates = Object.entries(pendingChanges).map(([moduleId, newStatus]) => ({
        id: moduleId,
        status: newStatus,
        updated_at: new Date().toISOString()
      }));
      
      // Si nous avons des changements, mettre à jour directement la table
      if (updates.length > 0) {
        for (const update of updates) {
          const { error } = await supabase
            .from("app_modules")
            .update({ 
              status: update.status,
              updated_at: update.updated_at
            })
            .eq("id", update.id);
            
          if (error) throw error;
        }
      }
      
      // Appliquer tous les changements de modules
      const updatePromises = Object.entries(pendingChanges).map(async ([moduleId, newStatus]) => {
        // Trouver le module
        const module = modules.find(m => m.id === moduleId);
        if (!module) return;
        
        // Si le module est désactivé, désactiver également toutes ses fonctionnalités
        if (newStatus === 'inactive' && module.features) {
          const featurePromises = Object.keys(module.features).map(featureCode => 
            updateFeatureStatus(module.code, featureCode, false)
          );
          await Promise.all(featurePromises);
        }
        
        // Mettre à jour le statut du module
        await updateModuleStatus(moduleId, newStatus);
      });
      
      await Promise.all(updatePromises);
      
      // Réinitialiser les changements en attente
      resetPendingChanges();
      
      toast({
        title: "Modifications enregistrées",
        description: "Les modules et leurs fonctionnalités ont été mis à jour",
      });
      
      // Déclencher l'événement personnalisé pour les mises à jour des modules
      triggerModuleStatusChanged();
      
      // Rafraîchir les données
      await refreshModules();
      
      // Notifier le parent que les statuts ont changé
      if (onStatusChange) {
        onStatusChange();
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
  };

  return {
    saving,
    saveChanges
  };
};
