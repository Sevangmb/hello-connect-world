
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ModuleUnavailable } from "./ModuleUnavailable";
import { ModuleDegraded } from "./ModuleDegraded";
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
  const [isActive, setIsActive] = useState<boolean>(true);
  const [isDegraded, setIsDegraded] = useState(false);
  const { toast } = useToast();
  
  // Utiliser directement le hook des modules
  const { isModuleActive, isModuleDegraded, refreshModules } = useModules();

  // Vérification immédiate pour les modules admin
  const isAdmin = useMemo(() => {
    const adminCheck = isAdminModule(moduleCode) || 
                      moduleCode === 'admin' || 
                      moduleCode.startsWith('admin_') || 
                      moduleCode.startsWith('admin');
    if (adminCheck) {
      console.log(`ModuleGuard: Module admin ${moduleCode} détecté, toujours actif`);
    }
    return adminCheck;
  }, [moduleCode]);
  
  // Callback memoizé pour vérifier le statut
  const checkStatus = useCallback(async () => {
    // Vérifier d'abord si c'est un module admin ou challenge
    if (isAdmin || moduleCode === 'challenges' || moduleCode === 'admin_modules') {
      console.log(`ModuleGuard: Module ${moduleCode} toujours actif (admin ou challenge)`);
      setIsActive(true);
      setIsDegraded(false);
      return;
    }
    
    // Vérifier le cache global d'abord pour éviter des appels inutiles
    const cachedStatus = moduleStatusGlobalCache[moduleCode];
    const now = Date.now();
    
    if (cachedStatus && (now - cachedStatus.timestamp < GLOBAL_CACHE_VALIDITY_MS)) {
      setIsActive(cachedStatus.active);
      setIsDegraded(cachedStatus.degraded);
      return;
    }
    
    // Effectuer les vérifications via le hook
    try {
      const active = isModuleActive(moduleCode);
      const degraded = isModuleDegraded(moduleCode);
      
      console.log(`ModuleGuard: Vérification du module ${moduleCode} - Actif: ${active}, Dégradé: ${degraded}`);
      
      setIsActive(active);
      setIsDegraded(degraded);
      
      // Mettre à jour le cache global
      moduleStatusGlobalCache[moduleCode] = {
        active,
        degraded,
        timestamp: now
      };
    } catch (error) {
      console.error(`Erreur lors de la vérification du statut du module ${moduleCode}:`, error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Impossible de vérifier le statut du module ${moduleCode}`,
      });
    }
  }, [moduleCode, isAdmin, isModuleActive, isModuleDegraded, toast]);

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

  // Si c'est un module admin, on affiche toujours le contenu (traitement spécial)
  if (isAdmin || moduleCode.startsWith('admin') || moduleCode === 'admin_modules') {
    return <>{children}</>;
  }

  // Pour les modules challenges, temporairement activer toujours
  if (moduleCode === 'challenges') {
    return <>{children}</>;
  }

  // Toujours autoriser l'accès pour le développement
  if (process.env.NODE_ENV === 'development') {
    return <>{children}</>;
  }

  // Pour les autres modules, on respecte leur statut
  if (!isActive) {
    return fallback ? <>{fallback}</> : <ModuleUnavailable moduleCode={moduleCode} />;
  }

  if (isDegraded) {
    return (
      <>
        <ModuleDegraded moduleCode={moduleCode} />
        {children}
      </>
    );
  }

  return <>{children}</>;
}
