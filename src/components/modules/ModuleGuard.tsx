
import React, { useState, useEffect } from "react";
import { useModules } from "@/hooks/modules";
import { ModuleUnavailable } from "./ModuleUnavailable";
import { ModuleDegraded } from "./ModuleDegraded";

interface ModuleGuardProps {
  moduleCode: string;
  children: React.ReactNode;
}

export function ModuleGuard({ moduleCode, children }: ModuleGuardProps) {
  const { isModuleActive, isModuleDegraded, refreshModules } = useModules();
  const [isActive, setIsActive] = useState(true);
  const [isDegraded, setIsDegraded] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkModuleStatus = async () => {
      setIsChecking(true);
      // Force refresh modules data first
      await refreshModules();
      
      // Then check the status
      const active = isModuleActive(moduleCode);
      const degraded = isModuleDegraded(moduleCode);
      
      console.log(`ModuleGuard: Module ${moduleCode} - active: ${active}, degraded: ${degraded}`);
      
      setIsActive(active);
      setIsDegraded(degraded);
      setIsChecking(false);
    };

    checkModuleStatus();
  }, [moduleCode, isModuleActive, isModuleDegraded, refreshModules]);

  if (isChecking) {
    return <div className="p-2">Vérification du module {moduleCode}...</div>;
  }

  if (!isActive) {
    return <ModuleUnavailable moduleCode={moduleCode} />;
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
