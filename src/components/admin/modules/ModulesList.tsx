
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { useModules } from "@/hooks/modules";
import { useToast } from "@/hooks/use-toast";
import { ModuleStatus } from "@/hooks/modules/types";
import { ModuleRow } from "./components/ModuleRow";
import { SaveChangesButton } from "./components/SaveChangesButton";
import { supabase } from "@/integrations/supabase/client";
import { triggerModuleStatusChanged } from "@/hooks/modules/events";

interface ModulesListProps {
  onStatusChange?: () => void;
}

export const ModulesList: React.FC<ModulesListProps> = ({ onStatusChange }) => {
  const { 
    modules, 
    dependencies, 
    loading, 
    isModuleActive, 
    updateModuleStatus,
    updateFeatureStatus,
    refreshModules
  } = useModules();
  
  const { toast } = useToast();
  const [pendingChanges, setPendingChanges] = useState<Record<string, ModuleStatus>>({});
  const [saving, setSaving] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Refresh modules data periodically to ensure it's up to date
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      refreshModules().then(() => {
        setLastRefresh(new Date());
        console.log("Modules refreshed automatically at", new Date().toLocaleTimeString());
      });
    }, 30000); // Refresh every 30 seconds
    
    // Listen for module status changed events from other tabs
    const handleModuleStatusChanged = () => {
      refreshModules().then(() => {
        setLastRefresh(new Date());
        console.log("Modules refreshed due to status change at", new Date().toLocaleTimeString());
      });
    };
    
    window.addEventListener('module_status_changed', handleModuleStatusChanged);
    
    return () => {
      clearInterval(refreshInterval);
      window.removeEventListener('module_status_changed', handleModuleStatusChanged);
    };
  }, [refreshModules]);

  // Vérifier si on peut changer le statut d'un module
  const canToggleModule = (moduleId: string, isCore: boolean) => {
    if (isCore) return false; // Impossible de désactiver un module core
    
    // Vérifier les dépendances requises
    const requiredBy = dependencies.filter(d => 
      d.dependency_id === moduleId && 
      d.is_required && 
      d.module_status === 'active'
    );
    
    return requiredBy.length === 0;
  };

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

  // Enregistrer tous les changements
  const saveChanges = async () => {
    try {
      setSaving(true);
      
      // Utiliser Supabase pour les transactions
      const { error: transactionError } = await supabase.rpc('update_modules_batch', {
        module_updates: Object.entries(pendingChanges).map(([moduleId, newStatus]) => ({
          id: moduleId,
          status: newStatus,
          updated_at: new Date().toISOString()
        }))
      });

      if (transactionError) {
        throw transactionError;
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
      setPendingChanges({});
      
      toast({
        title: "Modifications enregistrées",
        description: "Les modules et leurs fonctionnalités ont été mis à jour",
      });
      
      // Déclencher l'événement personnalisé pour les mises à jour des modules
      triggerModuleStatusChanged();
      
      // Rafraîchir les données
      await refreshModules();
      setLastRefresh(new Date());
      
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

  // Rafraîchir manuellement les modules
  const handleRefresh = async () => {
    try {
      await refreshModules();
      setLastRefresh(new Date());
      
      toast({
        title: "Données rafraîchies",
        description: "Les modules ont été actualisés avec succès",
      });
    } catch (error) {
      console.error("Erreur lors du rafraîchissement des modules:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de rafraîchir les modules",
      });
    }
  };

  // Vérifier s'il y a des changements en attente
  const hasPendingChanges = Object.keys(pendingChanges).length > 0;

  if (loading) {
    return <div className="flex justify-center p-8">Chargement des modules...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestion des Modules</CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Dernière mise à jour: {lastRefresh.toLocaleTimeString()}</span>
          <button 
            onClick={handleRefresh} 
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
          >
            Actualiser
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Module</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Dépendances</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modules.map((module) => {
              const currentStatus = getModuleStatus(module.id, module.status);
              return (
                <ModuleRow
                  key={module.id}
                  module={module}
                  dependencies={dependencies}
                  currentStatus={currentStatus}
                  isModuleActive={isModuleActive}
                  canToggleModule={canToggleModule}
                  pendingChanges={pendingChanges}
                  handleToggleModule={handleToggleModule}
                />
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          {modules.length} modules disponibles
        </div>
        <SaveChangesButton
          hasPendingChanges={hasPendingChanges}
          saving={saving}
          onSave={saveChanges}
        />
      </CardFooter>
    </Card>
  );
};
