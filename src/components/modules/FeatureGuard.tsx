
import React from 'react';
import { useModules } from '@/hooks/modules/useModules';
import ModuleUnavailable from './ModuleUnavailable';

interface FeatureGuardProps {
  moduleCode: string;
  featureCode: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

const FeatureGuard: React.FC<FeatureGuardProps> = ({
  moduleCode,
  featureCode,
  fallback,
  children
}) => {
  const { isFeatureEnabled, isModuleActive, loading } = useModules();

  // Show loading state or nothing while loading
  if (loading) {
    return null;
  }

  // Check if the module is active and the feature is enabled
  const isEnabled = isFeatureEnabled(moduleCode, featureCode);
  const isActive = isModuleActive(moduleCode);

  if (!isActive) {
    return fallback ? <>{fallback}</> : <ModuleUnavailable moduleCode={moduleCode} />;
  }

  if (!isEnabled) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
};

export default FeatureGuard;
