
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { useModules } from "@/hooks/modules";
import { ModuleStatus } from "@/hooks/modules/types";
import { useToast } from "@/hooks/use-toast";
import { ModulesHeader } from "./components/ModulesHeader";
import { ModulesTable } from "./components/ModulesTable";
import { ModulesFooter } from "./components/ModulesFooter";
import { useModuleToggle } from "./hooks/useModuleToggle";
import { useModuleSave } from "./hooks/useModuleSave";
import { preloadModuleStatuses } from "@/hooks/modules/hooks/moduleStatus";

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

  // Memoize dependencies pour éviter les re-render inutiles
  const memoizedDependencies = useMemo(() => dependencies, [dependencies]);

  // Effet initial pour charger les modules avec préchargement
  useEffect(() => {
    const initialLoad = async () => {
      try {
        setLocalLoading(true);
        // Précharger les statuts pour une meilleure expérience
        await preloadModuleStatuses();
        await refreshModules();
        
        // Après 1 seconde, forcer l'affichage même si loading est toujours true
        setTimeout(() => {
          setLocalLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Erreur lors du chargement initial des modules:", error);
        setLocalLoading(false);
      }
    };
    
    initialLoad();
    
    // Force stop loading after 3 seconds no matter what
    const timer = setTimeout(() => {
      if (localLoading) {
        setLocalLoading(false);
        setLoadingTimeout(true);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  // Mettre à jour localLoading quand le chargement principal change
  useEffect(() => {
    if (!loading && modules.length > 0) {
      setLocalLoading(false);
    }
  }, [loading, modules]);

  // Refresh modules data periodically, avec un intervalle plus long
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      refreshModules().then(() => {
        setLastRefresh(new Date());
      });
    }, 60000); // Toutes les 60 secondes au lieu de 30 secondes
    
    // Listen for module status changed events from other tabs
    const handleModuleStatusChanged = () => {
      refreshModules().then(() => {
        setLastRefresh(new Date());
      });
    };
    
    window.addEventListener('module_status_changed', handleModuleStatusChanged);
    
    return () => {
      clearInterval(refreshInterval);
      window.removeEventListener('module_status_changed', handleModuleStatusChanged);
    };
  }, [refreshModules]);

  // Vérifier si on peut changer le statut d'un module (memoizé pour la performance)
  const canToggleModule = useCallback((moduleId: string, isCore: boolean) => {
    if (isCore) return false; // Impossible de désactiver un module core
    
    // Vérifier les dépendances requises
    const requiredBy = memoizedDependencies.filter(d => 
      d.dependency_id === moduleId && 
      d.is_required && 
      d.module_status === 'active'
    );
    
    return requiredBy.length === 0;
  }, [memoizedDependencies]);

  // Rafraîchir manuellement les modules
  const handleRefresh = useCallback(async () => {
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
  }, [refreshModules, toast]);

  // Soit nous utilisons localLoading, soit nous vérifions si les modules sont vides après le timeout
  const isLoading = localLoading;

  // Memoize le contenu de la table pour éviter les re-render inutiles
  const table = useMemo(() => (
    <ModulesTable
      modules={modules}
      dependencies={memoizedDependencies}
      pendingChanges={pendingChanges}
      isModuleActive={isModuleActive}
      canToggleModule={canToggleModule}
      handleToggleModule={handleToggleModule}
      getModuleStatus={getModuleStatus}
    />
  ), [modules, memoizedDependencies, pendingChanges, isModuleActive, canToggleModule, handleToggleModule, getModuleStatus]);

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded w-full"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
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
        ) : table}
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
