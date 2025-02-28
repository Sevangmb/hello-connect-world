
import React, { useEffect, useState } from "react";
import { useModules } from "@/hooks/modules";
import { ModuleUnavailable } from "./ModuleUnavailable";
import { ModuleDegraded } from "./ModuleDegraded";
import { onModuleStatusChanged } from "@/hooks/modules/events";
import { getModuleStatusesFromCache } from "@/hooks/modules/utils";

interface ModuleGuardProps {
  children: React.ReactNode;
  moduleCode: string;
  fallback?: React.ReactNode;
}

export function ModuleGuard({ children, moduleCode, fallback }: ModuleGuardProps) {
  const { isModuleActive, isModuleDegraded, refreshModules } = useModules();
  const [isActive, setIsActive] = useState(() => {
    // Vérifier d'abord le cache pour une réponse immédiate
    const cachedStatuses = getModuleStatusesFromCache();
    if (cachedStatuses && cachedStatuses[moduleCode]) {
      return cachedStatuses[moduleCode] === 'active';
    }
    return isModuleActive(moduleCode);
  });
  const [isDegraded, setIsDegraded] = useState(() => {
    // Vérifier d'abord le cache pour une réponse immédiate
    const cachedStatuses = getModuleStatusesFromCache();
    if (cachedStatuses && cachedStatuses[moduleCode]) {
      return cachedStatuses[moduleCode] === 'degraded';
    }
    return isModuleDegraded(moduleCode);
  });

  useEffect(() => {
    const handleModuleChange = () => {
      console.log(`Module status check for ${moduleCode}`);
      const moduleActive = isModuleActive(moduleCode);
      const moduleDegraded = isModuleDegraded(moduleCode);
      
      console.log(`Module ${moduleCode} status: active=${moduleActive}, degraded=${moduleDegraded}`);
      
      setIsActive(moduleActive);
      setIsDegraded(moduleDegraded);
    };
    
    // Vérification initiale
    handleModuleChange();
    
    // Forcer un refresh des modules au montage du composant
    refreshModules().then(() => {
      handleModuleChange();
    });
    
    // Souscrire aux changements de status des modules
    const cleanup = onModuleStatusChanged(handleModuleChange);
    
    // Configurer un intervalle de vérification périodique pour s'assurer de l'état à jour
    const intervalId = setInterval(() => {
      handleModuleChange();
    }, 30000); // Toutes les 30 secondes
    
    return () => {
      cleanup();
      clearInterval(intervalId);
    };
  }, [moduleCode, isModuleActive, isModuleDegraded, refreshModules]);

  // Force re-evaluation when isModuleActive changes
  useEffect(() => {
    setIsActive(isModuleActive(moduleCode));
  }, [isModuleActive, moduleCode]);

  // Force re-evaluation when isModuleDegraded changes
  useEffect(() => {
    setIsDegraded(isModuleDegraded(moduleCode));
  }, [isModuleDegraded, moduleCode]);

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

// Exporter aussi par défaut pour assurer la compatibilité
export default ModuleGuard;
