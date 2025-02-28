
import React, { useEffect, useState } from "react";
import { useModuleApiContext } from "@/hooks/modules/ModuleApiContext";
import { ModuleUnavailable } from "./ModuleUnavailable";
import { ModuleDegraded } from "./ModuleDegraded";
import { onModuleStatusChanged } from "@/hooks/modules/events";

interface ModuleGuardProps {
  children: React.ReactNode;
  moduleCode: string;
  fallback?: React.ReactNode;
}

export function ModuleGuard({ children, moduleCode, fallback }: ModuleGuardProps) {
  const { 
    getModuleActiveStatus, 
    getModuleDegradedStatus, 
    refreshModules 
  } = useModuleApiContext();
  
  const [isActive, setIsActive] = useState(() => getModuleActiveStatus(moduleCode));
  const [isDegraded, setIsDegraded] = useState(() => getModuleDegradedStatus(moduleCode));

  useEffect(() => {
    const handleModuleChange = () => {
      console.log(`Module status check for ${moduleCode}`);
      const moduleActive = getModuleActiveStatus(moduleCode);
      const moduleDegraded = getModuleDegradedStatus(moduleCode);
      
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
  }, [moduleCode, getModuleActiveStatus, getModuleDegradedStatus, refreshModules]);

  // Forcer la réévaluation quand getModuleActiveStatus change
  useEffect(() => {
    setIsActive(getModuleActiveStatus(moduleCode));
  }, [getModuleActiveStatus, moduleCode]);

  // Forcer la réévaluation quand getModuleDegradedStatus change
  useEffect(() => {
    setIsDegraded(getModuleDegradedStatus(moduleCode));
  }, [getModuleDegradedStatus, moduleCode]);

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
