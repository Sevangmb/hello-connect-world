
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ModuleUnavailable } from "./ModuleUnavailable";
import { ModuleDegraded } from "./ModuleDegraded";
import { getModuleStatusFromCache } from "@/hooks/modules/api/moduleStatusCore";
import { isAdminModule } from "@/hooks/modules/api/moduleStatusCore";
import { useToast } from "@/hooks/use-toast";
import { useModules } from "@/hooks/modules/useModules";

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
  
  // Utiliser directement le hook des modules
  const { isModuleActive, isModuleDegraded, refreshModules } = useModules();

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
    
    try {
      // Vérifier d'abord le cache global
      const now = Date.now();
      const cachedStatus = moduleStatusGlobalCache[moduleCode];
      
      if (cachedStatus && (now - cachedStatus.timestamp < GLOBAL_CACHE_VALIDITY_MS)) {
        // Utiliser le cache global pour une meilleure performance
        setIsActive(cachedStatus.active);
        setIsDegraded(cachedStatus.degraded);
        return;
      }
      
      // Vérifier directement avec le hook des modules
      const active = isModuleActive(moduleCode);
      const degraded = isModuleDegraded(moduleCode);
      
      // Mettre à jour le cache global
      moduleStatusGlobalCache[moduleCode] = {
        active,
        degraded,
        timestamp: now
      };
      
      setIsActive(active);
      setIsDegraded(degraded);
    } catch (error) {
      console.error(`Erreur lors de la vérification du statut du module ${moduleCode}:`, error);
      
      // En cas d'erreur, essayer de réinitialiser le cache global et rafraîchir les modules
      delete moduleStatusGlobalCache[moduleCode];
      refreshModules().catch(console.error);
      
      // Afficher temporairement le module pour éviter un blocage complet
      setIsActive(true);
      setIsDegraded(true);
      
      toast({
        variant: "destructive",
        title: "Erreur système",
        description: "Impossible de vérifier l'état du module. Réessayez plus tard.",
      });
    }
  }, [moduleCode, isAdmin, isModuleActive, isModuleDegraded, refreshModules, toast]);

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
