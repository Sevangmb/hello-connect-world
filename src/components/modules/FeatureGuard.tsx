
import { ReactNode } from 'react';
import { toast } from 'sonner';
import { useModuleApi } from '@/hooks/modules/ModuleApiContext';

interface FeatureGuardProps {
  moduleCode: string;
  featureCode: string;
  children: ReactNode;
  fallback?: ReactNode;
  silent?: boolean;
}

export const FeatureGuard = ({
  moduleCode,
  featureCode,
  children,
  fallback,
  silent = false
}: FeatureGuardProps) => {
  // Récupérer l'état des modules et des fonctionnalités
  const { features, modules, loading } = useModuleApi();

  // Si chargement en cours, afficher un placeholder
  if (loading) {
    return null;
  }

  // Vérifier si le module existe
  const module = modules.find(m => m.code === moduleCode);
  if (!module) {
    if (!silent) {
      toast.error(`Module ${moduleCode} non trouvé`);
    }
    return fallback ? <>{fallback}</> : null;
  }

  // Vérifier si le module est actif
  if (module.status !== 'active') {
    if (!silent) {
      toast.error(`Module ${moduleCode} non actif`);
    }
    return fallback ? <>{fallback}</> : null;
  }

  // Vérifier si la fonctionnalité existe et est activée
  const moduleFeatures = features[moduleCode];
  if (!moduleFeatures || moduleFeatures[featureCode] !== true) {
    if (!silent) {
      toast.error(`Fonctionnalité ${featureCode} non disponible`);
    }
    return fallback ? <>{fallback}</> : null;
  }

  // Si tout est bon, afficher le contenu
  return <>{children}</>;
};
