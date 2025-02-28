
import React, { useEffect, useState } from "react";
import { useModules } from "@/hooks/modules";

interface FeatureGuardProps {
  moduleCode: string;
  featureCode: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
  loadingView?: React.ReactNode;
  debug?: boolean;
}

export const FeatureGuard: React.FC<FeatureGuardProps> = ({ 
  moduleCode, 
  featureCode, 
  fallback = null, 
  loadingView = null,
  children,
  debug = false
}) => {
  const { isFeatureEnabled, loading } = useModules();
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);

  // Mettre à jour l'état local quand isFeatureEnabled change
  useEffect(() => {
    if (!loading) {
      setIsEnabled(isFeatureEnabled(moduleCode, featureCode));
    }
  }, [loading, isFeatureEnabled, moduleCode, featureCode]);

  // Écouter les événements de mise à jour des fonctionnalités
  useEffect(() => {
    const handleFeatureChange = () => {
      setIsEnabled(isFeatureEnabled(moduleCode, featureCode));
    };
    
    window.addEventListener('feature_status_changed', handleFeatureChange);
    window.addEventListener('app_modules_updated', handleFeatureChange);
    
    return () => {
      window.removeEventListener('feature_status_changed', handleFeatureChange);
      window.removeEventListener('app_modules_updated', handleFeatureChange);
    };
  }, [moduleCode, featureCode, isFeatureEnabled]);

  // Afficher des informations de débogage si demandé
  if (debug && isEnabled !== null) {
    console.debug(`FeatureGuard [${moduleCode}:${featureCode}]:`, {
      isEnabled
    });
  }

  // Pendant le chargement, afficher la vue de chargement ou rien
  if (loading && isEnabled === null) return <>{loadingView}</>;

  // Si la fonctionnalité est activée
  if (isEnabled) {
    return <>{children}</>;
  }

  // Si la fonctionnalité est désactivée
  return <>{fallback}</>;
};

export default FeatureGuard;
