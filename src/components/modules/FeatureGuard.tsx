
import React from "react";
import { useModules } from "@/hooks/useModules";

interface FeatureGuardProps {
  moduleCode: string;
  featureCode: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const FeatureGuard: React.FC<FeatureGuardProps> = ({ 
  moduleCode, 
  featureCode, 
  fallback = null, 
  children 
}) => {
  const { isFeatureEnabled, loading } = useModules();

  // Pendant le chargement, ne rien afficher
  if (loading) return null;

  // Si la fonctionnalité est activée, afficher le contenu
  if (isFeatureEnabled(moduleCode, featureCode)) {
    return <>{children}</>;
  }

  // Sinon, afficher le fallback s'il existe
  return <>{fallback}</>;
};

export default FeatureGuard;
