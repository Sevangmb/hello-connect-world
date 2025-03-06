
import React from 'react';
import { ModuleUnavailable } from './ModuleUnavailable';
import { useModuleApi } from '@/hooks/modules/ModuleApiContext';

interface FeatureGuardProps {
  moduleCode: string;
  featureCode: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const FeatureGuard: React.FC<FeatureGuardProps> = ({
  moduleCode,
  featureCode,
  fallback,
  children
}) => {
  const { features, isInitialized } = useModuleApi();

  if (!isInitialized) {
    return null; // Ne rien afficher pendant le chargement des modules
  }

  // Vérifier si la fonctionnalité est activée
  const isEnabled = features?.[moduleCode]?.[featureCode] === true;

  if (!isEnabled) {
    return fallback ? <>{fallback}</> : <ModuleUnavailable />;
  }

  return <>{children}</>;
};
