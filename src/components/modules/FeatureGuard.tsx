
import React from 'react';
import { useModuleCore } from '@/hooks/modules/useModuleCore';
import { ModuleUnavailable } from './ModuleUnavailable';

interface FeatureGuardProps {
  moduleCode: string;
  featureCode: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ModuleUnavailableProps {
  moduleCode: string;
}

export function FeatureGuard({ 
  moduleCode, 
  featureCode, 
  children, 
  fallback 
}: FeatureGuardProps) {
  const { isFeatureEnabled, isModuleActive } = useModuleCore();
  
  // Check if the module is active
  const moduleIsActive = isModuleActive(moduleCode);
  
  // If module is active, check if feature is enabled
  const featureIsEnabled = moduleIsActive && isFeatureEnabled(moduleCode, featureCode);
  
  if (!moduleIsActive) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <ModuleUnavailable moduleCode={moduleCode} />
    );
  }
  
  if (!featureIsEnabled) {
    return fallback ? <>{fallback}</> : null;
  }
  
  return <>{children}</>;
}
