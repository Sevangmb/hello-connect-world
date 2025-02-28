
import React from "react";
import { useModules } from "@/hooks/useModules";

interface FeatureGuardProps {
  moduleCode: string;
  featureCode: string;
  fallback?: React.ReactNode;
  degradedView?: React.ReactNode;
  children: React.ReactNode;
  loadingView?: React.ReactNode;
}

export const FeatureGuard: React.FC<FeatureGuardProps> = ({ 
  moduleCode, 
  featureCode, 
  fallback = null,
  degradedView = null,
  loadingView = null,
  children 
}) => {
  const { isFeatureEnabled, isModuleActive, isModuleDegraded, loading } = useModules();

  // Pendant le chargement, afficher la vue de chargement ou rien
  if (loading) return <>{loadingView}</>;

  // Si la fonctionnalité est activée (le module doit être actif ET la fonctionnalité activée)
  if (isFeatureEnabled(moduleCode, featureCode)) {
    return <>{children}</>;
  }

  // Si le module est en mode dégradé et qu'il y a une vue dégradée
  if (isModuleDegraded(moduleCode) && degradedView) {
    return <>{degradedView}</>;
  }

  // Si la fonctionnalité est désactivée ou le module est inactif
  return <>{fallback}</>;
};

export default FeatureGuard;
