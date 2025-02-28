
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { useModules } from "@/hooks/modules";
import { ModuleStatus } from "@/hooks/modules/types";
import { useToast } from "@/hooks/use-toast";
import { ModulesHeader } from "./components/ModulesHeader";
import { ModulesTable } from "./components/ModulesTable";
import { ModulesFooter } from "./components/ModulesFooter";
import { useModuleToggle } from "./hooks/useModuleToggle";
import { useModuleSave } from "./hooks/useModuleSave";

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
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  
  const {
    pendingChanges,
    handleToggleModule,
    getModuleStatus,
    hasPendingChanges,
    resetPendingChanges
  } = useModuleToggle();
  
  const { saving, saveChanges } = useModuleSave({
    modules,
    updateModuleStatus,
    updateFeatureStatus,
    refreshModules,
    pendingChanges,
    resetPendingChanges,
    onStatusChange
  });

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

  if (loading) {
    return <div className="flex justify-center p-8">Chargement des modules...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <ModulesHeader 
          lastRefresh={lastRefresh} 
          onRefresh={handleRefresh} 
        />
      </CardHeader>
      <CardContent>
        <ModulesTable
          modules={modules}
          dependencies={dependencies}
          pendingChanges={pendingChanges}
          isModuleActive={isModuleActive}
          canToggleModule={canToggleModule}
          handleToggleModule={handleToggleModule}
          getModuleStatus={getModuleStatus}
        />
      </CardContent>
      <CardFooter>
        <ModulesFooter
          moduleCount={modules.length}
          hasPendingChanges={hasPendingChanges}
          saving={saving}
          onSave={saveChanges}
        />
      </CardFooter>
    </Card>
  );
};
