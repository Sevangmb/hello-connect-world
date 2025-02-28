
import React, { ReactNode } from 'react';
import { useModuleApiContext } from '@/hooks/modules/ModuleApiContext';
import { ADMIN_MODULE_CODE } from '@/hooks/modules/useModules';

interface FeatureGuardProps {
  moduleCode: string;
  featureCode: string;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Composant qui protège un contenu en fonction de l'état d'une fonctionnalité
 * Affiche le contenu uniquement si la fonctionnalité est activée
 */
export const FeatureGuard: React.FC<FeatureGuardProps> = ({
  moduleCode,
  featureCode,
  children,
  fallback
}) => {
  const { getFeatureEnabledStatus } = useModuleApiContext();

  // Toujours autoriser les fonctionnalités du module Admin
  if (moduleCode === ADMIN_MODULE_CODE) {
    return <>{children}</>;
  }

  // Vérifier si la fonctionnalité est activée
  const isEnabled = getFeatureEnabledStatus(moduleCode, featureCode);

  // Si la fonctionnalité n'est pas activée, afficher le fallback (ou rien)
  if (!isEnabled) {
    return fallback ? <>{fallback}</> : null;
  }

  // Si la fonctionnalité est activée, afficher le contenu
  return <>{children}</>;
};

export default FeatureGuard;
