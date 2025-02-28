
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
  const [localLoading, setLocalLoading] = useState<boolean>(true);
  const [loadingTimeout, setLoadingTimeout] = useState<boolean>(false);
  
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

  // Effet initial pour charger les modules
  useEffect(() => {
    const initialLoad = async () => {
      try {
        await refreshModules();
        console.log("Modules chargés initialement:", modules.length);
        // Après 2 secondes, forcer l'affichage même si loading est toujours true
        setTimeout(() => {
          setLocalLoading(false);
        }, 2000);
      } catch (error) {
        console.error("Erreur lors du chargement initial des modules:", error);
        setLocalLoading(false);
      }
    };
    
    initialLoad();
    
    // Force stop loading after 5 seconds no matter what
    const timer = setTimeout(() => {
      if (localLoading) {
        console.log("Force stop loading after timeout");
        setLocalLoading(false);
        setLoadingTimeout(true);
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  // Mettre à jour localLoading quand le chargement principal change
  useEffect(() => {
    if (!loading && modules.length > 0) {
      setLocalLoading(false);
    }
  }, [loading, modules]);

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
      setLocalLoading(true);
      await refreshModules();
      setLastRefresh(new Date());
      setLocalLoading(false);
      
      toast({
        title: "Données rafraîchies",
        description: "Les modules ont été actualisés avec succès",
      });
    } catch (error) {
      console.error("Erreur lors du rafraîchissement des modules:", error);
      setLocalLoading(false);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de rafraîchir les modules",
      });
    }
  };

  // Soit nous utilisons localLoading, soit nous vérifions si les modules sont vides après le timeout
  const isLoading = localLoading && (!loadingTimeout || modules.length === 0);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="mb-4">Chargement des modules...</div>
        {loadingTimeout && (
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Rafraîchir manuellement
          </button>
        )}
      </div>
    );
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
        {modules.length === 0 ? (
          <div className="text-center py-8">
            <p className="mb-4">Aucun module trouvé. Veuillez rafraîchir la page ou vérifier la connexion à la base de données.</p>
            <button 
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Rafraîchir maintenant
            </button>
          </div>
        ) : (
          <ModulesTable
            modules={modules}
            dependencies={dependencies}
            pendingChanges={pendingChanges}
            isModuleActive={isModuleActive}
            canToggleModule={canToggleModule}
            handleToggleModule={handleToggleModule}
            getModuleStatus={getModuleStatus}
          />
        )}
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
