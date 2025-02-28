
import React from "react";
import { useModules } from "@/hooks/useModules";

interface ModuleGuardProps {
  moduleCode: string;
  fallback?: React.ReactNode;
  degradedView?: React.ReactNode;
  children: React.ReactNode;
  loadingView?: React.ReactNode;
  debug?: boolean;
}

export const ModuleGuard: React.FC<ModuleGuardProps> = ({ 
  moduleCode, 
  fallback = null, 
  degradedView = null,
  loadingView = null,
  children,
  debug = false
}) => {
  const { isModuleActive, isModuleDegraded, loading } = useModules();

  // Afficher des informations de débogage si demandé
  if (debug && !loading) {
    console.debug(`ModuleGuard [${moduleCode}]:`, {
      isActive: isModuleActive(moduleCode),
      isDegraded: isModuleDegraded(moduleCode)
    });
  }

  // Pendant le chargement, afficher la vue de chargement ou rien
  if (loading) return <>{loadingView}</>;

  // Si le module est actif
  if (isModuleActive(moduleCode)) {
    return <>{children}</>;
  }

  // Si le module est en mode dégradé et qu'il y a une vue dégradée
  if (isModuleDegraded(moduleCode) && degradedView) {
    return <>{degradedView}</>;
  }

  // Si le module est inactif ou en mode dégradé sans vue dégradée
  return <>{fallback}</>;
};

export default ModuleGuard;
