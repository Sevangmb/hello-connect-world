
import React from 'react';
import { useModuleApi } from '@/hooks/modules/ModuleApiContext';
import { ModuleUnavailable } from './ModuleUnavailable';

interface FeatureGuardProps {
  moduleCode: string;
  featureCode: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Feature Guard
 * Renders children only if a specific feature is enabled
 */
export const FeatureGuard: React.FC<FeatureGuardProps> = ({
  moduleCode,
  featureCode,
  children,
  fallback
}) => {
  const { features, isInitialized } = useModuleApi();
  
  // Si les features ne sont pas encore chargées, on attend
  if (!isInitialized) {
    return null;
  }
  
  // Vérifier si la fonctionnalité est activée
  const isEnabled = features?.[moduleCode]?.[featureCode];
  
  if (isEnabled) {
    return <>{children}</>;
  }
  
  // Afficher un fallback ou le message par défaut
  if (fallback) {
    return <>{fallback}</>;
  }
  
  return <ModuleUnavailable moduleCode={moduleCode} />;
};
