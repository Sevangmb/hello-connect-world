
import React from "react";
import { useModules } from "@/hooks/modules";
import { useEffect, useState } from "react";
import { onFeatureStatusChanged } from "@/hooks/modules/events";

interface FeatureGuardProps {
  children: React.ReactNode;
  moduleCode: string;
  featureCode: string;
  fallback?: React.ReactNode;
}

export function FeatureGuard({ children, moduleCode, featureCode, fallback }: FeatureGuardProps) {
  const { isFeatureEnabled } = useModules();
  const [isEnabled, setIsEnabled] = useState(isFeatureEnabled(moduleCode, featureCode));

  useEffect(() => {
    const handleFeatureChange = () => {
      setIsEnabled(isFeatureEnabled(moduleCode, featureCode));
    };
    
    // Initial check
    setIsEnabled(isFeatureEnabled(moduleCode, featureCode));
    
    // Subscribe to feature changes
    const cleanup = onFeatureStatusChanged(handleFeatureChange);
    
    return cleanup;
  }, [moduleCode, featureCode, isFeatureEnabled]);

  if (!isEnabled) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}
