
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ModuleUnavailable } from "./ModuleUnavailable";
import { ModuleDegraded } from "./ModuleDegraded";
import { getModuleStatusFromCache } from "@/hooks/modules/api/moduleStatusCore";
import { isAdminModule } from "@/hooks/modules/api/moduleStatusCore";
import { useToast } from "@/hooks/use-toast";

interface ModuleGuardProps {
  moduleCode: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// Cache global en mémoire des statuts pour tous les composants ModuleGuard
const moduleStatusGlobalCache: Record<string, {active: boolean, degraded: boolean, timestamp: number}> = {};
// Durée de validité du cache global: 60 secondes pour plus de performance
const GLOBAL_CACHE_VALIDITY_MS = 60000;

export function ModuleGuard({ moduleCode, children, fallback }: ModuleGuardProps) {
  const [isActive, setIsActive] = useState<boolean>(true); // Par défaut actif pour éviter les flashs
  const [isDegraded, setIsDegraded] = useState(false);
  const { toast } = useToast();

  // Vérification immédiate pour les modules admin
  const isAdmin = useMemo(() => isAdminModule(moduleCode), [moduleCode]);
  
  // Callback memoizé pour vérifier le statut
  const checkStatus = useCallback(() => {
    // Si c'est un module admin, court-circuiter la vérification
    if (isAdmin) {
      setIsActive(true);
      setIsDegraded(false);
      return;
    }
    
    // Vérifier d'abord le cache global
    const now = Date.now();
    const cachedStatus = moduleStatusGlobalCache[moduleCode];
    
    if (cachedStatus && (now - cachedStatus.timestamp < GLOBAL_CACHE_VALIDITY_MS)) {
      // Utiliser le cache global pour une meilleure performance
      setIsActive(cachedStatus.active);
      setIsDegraded(cachedStatus.degraded);
      return;
    }
    
    try {
      // Vérifier le cache rapide
      const moduleStatus = getModuleStatusFromCache(moduleCode);
      if (moduleStatus !== null) {
        const active = moduleStatus !== 'inactive'; // Actif sauf si explicitement inactif
        const degraded = moduleStatus === 'degraded';
        
        // Mettre à jour le cache global
        moduleStatusGlobalCache[moduleCode] = {
          active,
          degraded,
          timestamp: now
        };
        
        setIsActive(active);
        setIsDegraded(degraded);
      } else {
        // Par défaut actif
        moduleStatusGlobalCache[moduleCode] = {
          active: true,
          degraded: false,
          timestamp: now
        };
        
        setIsActive(true);
        setIsDegraded(false);
      }
    } catch (error) {
      console.error(`Erreur lors de la vérification du statut du module ${moduleCode}:`, error);
      // En cas d'erreur, afficher temporairement le module
      setIsActive(true);
      toast({
        variant: "destructive",
        title: "Erreur système",
        description: "Impossible de vérifier l'état du module. Réessayez plus tard.",
      });
    }
  }, [moduleCode, isAdmin, toast]);

  // Effet qui s'exécute au premier rendu
  useEffect(() => {
    checkStatus();
    
    // Écouter les mises à jour de cache
    const handleCacheUpdate = () => {
      checkStatus();
    };
    
    window.addEventListener('module_cache_updated', handleCacheUpdate);
    
    // Vérifier périodiquement mais moins fréquemment (2 minutes)
    const intervalId = setInterval(checkStatus, 120000);
    
    return () => {
      window.removeEventListener('module_cache_updated', handleCacheUpdate);
      clearInterval(intervalId);
    };
  }, [checkStatus]);

  // Si le module est inactif et qu'un fallback est fourni, le montrer
  if (!isActive && fallback) {
    return <>{fallback}</>;
  }

  // Si le module est inactif, montrer le composant d'indisponibilité
  if (!isActive) {
    return <ModuleUnavailable moduleCode={moduleCode} />;
  }

  // Si le module est en mode dégradé, montrer l'avertissement mais quand même rendre le contenu
  if (isDegraded) {
    return (
      <>
        <ModuleDegraded moduleCode={moduleCode} />
        {children}
      </>
    );
  }

  // Module actif et non dégradé
  return <>{children}</>;
}
