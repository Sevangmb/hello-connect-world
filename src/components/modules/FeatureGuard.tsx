
import React from 'react';
import { useModules } from '@/hooks/modules';
import { useModuleApi } from '@/hooks/modules/ModuleApiContext';

interface FeatureGuardProps {
  moduleCode: string;
  featureCode: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const FeatureGuard: React.FC<FeatureGuardProps> = ({
  moduleCode,
  featureCode,
  children,
  fallback = null
}) => {
  const { isFeatureEnabled } = useModules();
  const isEnabled = isFeatureEnabled(moduleCode, featureCode);

  if (!isEnabled) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default FeatureGuard;
