
import React from "react";
import { useModuleApiContext } from "@/hooks/modules/ModuleApiContext";

interface FeatureGuardProps {
  children: React.ReactNode;
  moduleCode: string;
  featureCode: string;
  fallback?: React.ReactNode;
}

/**
 * Composant qui affiche conditionnellement son contenu en fonction
 * de l'état d'activation d'une fonctionnalité spécifique
 */
export function FeatureGuard({ children, moduleCode, featureCode, fallback }: FeatureGuardProps) {
  const { getFeatureEnabledStatus } = useModuleApiContext();
  const isEnabled = getFeatureEnabledStatus(moduleCode, featureCode);

  if (!isEnabled) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}

// Exporter aussi par défaut pour assurer la compatibilité
export default FeatureGuard;
