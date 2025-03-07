
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useModules } from "@/hooks/modules";
import { preloadModuleStatuses } from "@/hooks/modules/hooks/moduleStatus";
import { useToast } from "@/hooks/use-toast";
import { AppModule } from "@/hooks/modules/types";

export const useModulesList = (onStatusChange?: () => void) => {
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
  const initialLoadAttemptedRef = useRef(false);

  // Memoize dependencies pour éviter les re-render inutiles
  const memoizedDependencies = useMemo(() => dependencies, [dependencies]);

  // Effet initial pour charger les modules avec préchargement
  useEffect(() => {
    // Éviter les chargements multiples
    if (initialLoadAttemptedRef.current) return;
    initialLoadAttemptedRef.current = true;
    
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
  }, [refreshModules]);

  // Mettre à jour localLoading quand le chargement principal change
  useEffect(() => {
    if (!loading && modules.length > 0) {
      setLocalLoading(false);
    }
  }, [loading, modules]);

  // Refresh modules data periodically, avec un intervalle plus long et dédupliqué
  useEffect(() => {
    let refreshing = false;
    
    const refreshInterval = setInterval(async () => {
      // Éviter les rechargements simultanés
      if (refreshing) return;
      refreshing = true;
      
      try {
        await refreshModules();
        setLastRefresh(new Date());
      } catch (error) {
        console.error("Erreur lors du refresh périodique:", error);
      } finally {
        refreshing = false;
      }
    }, 120000); // Toutes les 2 minutes au lieu de 1 minute
    
    // Listen for module status changed events from other tabs
    const handleModuleStatusChanged = () => {
      if (refreshing) return;
      refreshing = true;
      
      refreshModules().then(() => {
        setLastRefresh(new Date());
        refreshing = false;
      }).catch(error => {
        console.error("Erreur lors du refresh suite à événement:", error);
        refreshing = false;
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

  return {
    modules,
    dependencies: memoizedDependencies,
    isLoading,
    lastRefresh,
    isModuleActive,
    updateModuleStatus,
    updateFeatureStatus,
    refreshModules,
    canToggleModule,
    handleRefresh
  };
};
