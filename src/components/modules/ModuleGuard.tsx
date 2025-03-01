
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
  // Forcer tous les modules à être actifs
  const [isActive, setIsActive] = useState<boolean>(true);
  const [isDegraded, setIsDegraded] = useState(false);
  const { toast } = useToast();
  
  // Utiliser directement le hook des modules
  const { isModuleActive, isModuleDegraded, refreshModules } = useModules();

  // Vérification immédiate pour les modules admin
  const isAdmin = useMemo(() => isAdminModule(moduleCode), [moduleCode]);
  
  // Callback memoizé pour vérifier le statut - mais toujours retourner actif
  const checkStatus = useCallback(() => {
    // Toujours considérer le module comme actif
    setIsActive(true);
    setIsDegraded(false);
    
    // Mettre à jour le cache global pour refléter l'état forcé
    moduleStatusGlobalCache[moduleCode] = {
      active: true,
      degraded: false,
      timestamp: Date.now()
    };
  }, [moduleCode]);

  // Effet qui s'exécute au premier rendu
  useEffect(() => {
    checkStatus();
    
    // Écouter les mises à jour de cache
    const handleCacheUpdate = () => {
      checkStatus();
    };
    
    window.addEventListener('module_cache_updated', handleCacheUpdate);
    
    return () => {
      window.removeEventListener('module_cache_updated', handleCacheUpdate);
    };
  }, [checkStatus]);

  // Toujours rendre le contenu principal, ignorer tous les états inactifs ou dégradés
  return <>{children}</>;
}
