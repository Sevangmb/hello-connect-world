
import React from "react";
import { useModules } from "@/hooks/modules";

interface FeatureGuardProps {
  moduleCode: string;
  featureCode: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
  loadingView?: React.ReactNode;
  debug?: boolean;
}

export const FeatureGuard: React.FC<FeatureGuardProps> = ({ 
  moduleCode, 
  featureCode, 
  fallback = null, 
  loadingView = null,
  children,
  debug = false
}) => {
  const { isFeatureEnabled, loading } = useModules();

  // Afficher des informations de débogage si demandé
  if (debug && !loading) {
    console.debug(`FeatureGuard [${moduleCode}:${featureCode}]:`, {
      isEnabled: isFeatureEnabled(moduleCode, featureCode)
    });
  }

  // Pendant le chargement, afficher la vue de chargement ou rien
  if (loading) return <>{loadingView}</>;

  // Si la fonctionnalité est activée
  if (isFeatureEnabled(moduleCode, featureCode)) {
    return <>{children}</>;
  }

  // Si la fonctionnalité est désactivée
  return <>{fallback}</>;
};

export default FeatureGuard;
