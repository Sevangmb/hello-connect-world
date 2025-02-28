
import React, { useEffect, useState } from "react";
import { useModules } from "@/hooks/modules";
import { createFeatureEventsListener } from "@/hooks/modules/events";

interface FeatureGuardProps {
  moduleCode: string;
  featureCode: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
  debug?: boolean;
}

export const FeatureGuard: React.FC<FeatureGuardProps> = ({
  moduleCode,
  featureCode,
  fallback = null,
  children,
  debug = false
}) => {
  const { isFeatureEnabled } = useModules();
  const [featureEnabled, setFeatureEnabled] = useState<boolean | null>(null);

  // S'abonner aux événements de changement de statut des fonctionnalités
  useEffect(() => {
    const checkFeatureStatus = () => {
      const enabled = isFeatureEnabled(moduleCode, featureCode);
      setFeatureEnabled(enabled);
      
      if (debug) {
        console.debug(`FeatureGuard [${moduleCode}/${featureCode}]:`, { isEnabled: enabled });
      }
    };

    // Vérifier immédiatement
    checkFeatureStatus();

    // Créer un abonnement aux événements de fonctionnalité
    const featureEvents = createFeatureEventsListener(checkFeatureStatus);
    
    // S'abonner aux événements
    featureEvents.subscribe();
    
    // Se désabonner à la destruction du composant
    return () => {
      featureEvents.unsubscribe();
    };
  }, [moduleCode, featureCode, isFeatureEnabled, debug]);

  // En attendant la première vérification
  if (featureEnabled === null) return null;

  // Rendu conditionnel basé sur l'état de la fonctionnalité
  return featureEnabled ? <>{children}</> : <>{fallback}</>;
};

export default FeatureGuard;
