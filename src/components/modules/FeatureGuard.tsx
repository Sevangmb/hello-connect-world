
import React, { ReactNode } from 'react';
import { useModules } from '@/hooks/modules';
import { ModuleUnavailable } from '@/components/modules/ModuleUnavailable';

interface FeatureGuardProps {
  featureCode: string;
  moduleCode: string;
  children: ReactNode;
  fallback?: React.ReactNode;
}

export const FeatureGuard: React.FC<FeatureGuardProps> = ({
  featureCode,
  moduleCode,
  children,
  fallback,
}) => {
  const { isFeatureEnabled, isModuleActive } = useModules();
  
  // Check if the module is active first
  const isModuleActiveStatus = isModuleActive(moduleCode);
  
  if (!isModuleActiveStatus) {
    return fallback || <ModuleUnavailable moduleCode={moduleCode} />;
  }
  
  // Then check if the feature is enabled
  const isFeatureEnabledStatus = isFeatureEnabled(featureCode);
  
  if (!isFeatureEnabledStatus) {
    return fallback || <ModuleUnavailable moduleCode={moduleCode} />;
  }
  
  // If both conditions are met, render the children
  return <>{children}</>;
};
