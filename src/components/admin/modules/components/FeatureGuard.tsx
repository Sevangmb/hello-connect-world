
import React, { useEffect, useState } from "react";
import { useModules } from "@/hooks/modules";
import { AlertTriangle } from "lucide-react";
import { onFeatureStatusChanged } from "@/hooks/modules/events";

interface FeatureGuardProps {
  children: React.ReactNode;
  moduleCode: string;
  featureCode: string;
  fallback?: React.ReactNode;
}

export function FeatureGuard({ children, moduleCode, featureCode, fallback }: FeatureGuardProps) {
  const { isFeatureEnabled, refreshModules } = useModules();
  const [isEnabled, setIsEnabled] = useState(() => isFeatureEnabled(moduleCode, featureCode));

  useEffect(() => {
    // Cette fonction sera appelée à chaque changement de statut des features
    const handleFeatureChange = () => {
      const featureActive = isFeatureEnabled(moduleCode, featureCode);
      setIsEnabled(featureActive);
    };
    
    // Vérification initiale
    handleFeatureChange();
    
    // Forcer un refresh
    refreshModules();
    
    // S'abonner aux changements
    const cleanup = onFeatureStatusChanged(handleFeatureChange);
    
    return cleanup;
  }, [moduleCode, featureCode, isFeatureEnabled, refreshModules]);

  // Réagir aux changements dans le hook isFeatureEnabled
  useEffect(() => {
    setIsEnabled(isFeatureEnabled(moduleCode, featureCode));
  }, [isFeatureEnabled, moduleCode, featureCode]);

  if (!isEnabled) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-md text-center">
        <div className="flex justify-center mb-2">
          <AlertTriangle className="h-6 w-6 text-yellow-500" />
        </div>
        <h3 className="text-sm font-medium text-yellow-800">
          Fonctionnalité non disponible
        </h3>
        <p className="mt-1 text-xs text-yellow-700">
          La fonctionnalité {featureCode} du module {moduleCode} n'est pas activée
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

export default FeatureGuard;
