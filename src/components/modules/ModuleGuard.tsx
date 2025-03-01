
import React, { useState, useEffect, useMemo } from "react";
import { useModules } from "@/hooks/modules";
import { ModuleUnavailable } from "./ModuleUnavailable";
import { ModuleDegraded } from "./ModuleDegraded";

interface ModuleGuardProps {
  moduleCode: string;
  children: React.ReactNode;
  fallback?: React.ReactNode; // Prop fallback optionnel
}

// Cache en mémoire des statuts des modules pour éviter de multiples vérifications
const moduleStatusCache: Record<string, {active: boolean, degraded: boolean, timestamp: number}> = {};

export function ModuleGuard({ moduleCode, children, fallback }: ModuleGuardProps) {
  const { isModuleActive, isModuleDegraded, refreshModules } = useModules();
  const [isActive, setIsActive] = useState(true);
  const [isDegraded, setIsDegraded] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Utiliser une clé de mémorisation pour éviter des rendus inutiles
  const memoKey = useMemo(() => `${moduleCode}-${Date.now()}`, [moduleCode]);

  useEffect(() => {
    const checkModuleStatus = async () => {
      // Vérifier le cache en mémoire d'abord
      const now = Date.now();
      const cachedStatus = moduleStatusCache[moduleCode];
      
      // Si nous avons un cache récent (moins de 10 secondes), l'utiliser
      if (cachedStatus && (now - cachedStatus.timestamp < 10000)) {
        console.log(`ModuleGuard: Utilisation du cache pour ${moduleCode}`);
        setIsActive(cachedStatus.active);
        setIsDegraded(cachedStatus.degraded);
        setIsChecking(false);
        return;
      }
      
      setIsChecking(true);
      
      try {
        // Force refresh modules data only if we don't have recent cache
        if (!cachedStatus || (now - cachedStatus.timestamp > 30000)) {
          await refreshModules();
        }
        
        // Then check the status
        const active = isModuleActive(moduleCode);
        const degraded = isModuleDegraded(moduleCode);
        
        console.log(`ModuleGuard: Module ${moduleCode} - active: ${active}, degraded: ${degraded}`);
        
        // Mettre à jour le cache
        moduleStatusCache[moduleCode] = {
          active, 
          degraded,
          timestamp: now
        };
        
        setIsActive(active);
        setIsDegraded(degraded);
      } catch (error) {
        console.error(`Erreur lors de la vérification du module ${moduleCode}:`, error);
        // En cas d'erreur, on considère le module comme actif pour éviter les blocages
        setIsActive(true);
        setIsDegraded(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkModuleStatus();
  }, [moduleCode, isModuleActive, isModuleDegraded, refreshModules, memoKey]);

  if (isChecking) {
    // Retourner un indicateur de chargement plus léger
    return <div className="text-xs text-gray-400">Chargement...</div>;
  }

  if (!isActive) {
    // Use custom fallback if provided, otherwise use default ModuleUnavailable
    return fallback || <ModuleUnavailable moduleCode={moduleCode} />;
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
