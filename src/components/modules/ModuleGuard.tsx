
import React, { useEffect, useState } from "react";
import { useModules } from "@/hooks/modules";
import { ModuleUnavailable } from "./ModuleUnavailable";
import { ModuleDegraded } from "./ModuleDegraded";
import { onModuleStatusChanged } from "@/hooks/modules/events";

interface ModuleGuardProps {
  children: React.ReactNode;
  moduleCode: string;
  fallback?: React.ReactNode;
}

export function ModuleGuard({ children, moduleCode, fallback }: ModuleGuardProps) {
  const { isModuleActive, isModuleDegraded } = useModules();
  const [isActive, setIsActive] = useState(isModuleActive(moduleCode));
  const [isDegraded, setIsDegraded] = useState(isModuleDegraded(moduleCode));

  useEffect(() => {
    const handleModuleChange = () => {
      setIsActive(isModuleActive(moduleCode));
      setIsDegraded(isModuleDegraded(moduleCode));
    };
    
    // Initial check
    setIsActive(isModuleActive(moduleCode));
    setIsDegraded(isModuleDegraded(moduleCode));
    
    // Subscribe to module changes
    const cleanup = onModuleStatusChanged(handleModuleChange);
    
    return cleanup;
  }, [moduleCode, isModuleActive, isModuleDegraded]);

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
