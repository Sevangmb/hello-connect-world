
import React, { ReactNode } from 'react';
import { ModuleUnavailable } from './ModuleUnavailable';
import { ModuleDegraded } from './ModuleDegraded';
import { useModuleApiContext } from '@/hooks/modules/ModuleApiContext';
import { ADMIN_MODULE_CODE } from '@/hooks/modules/useModules';

interface ModuleGuardProps {
  moduleCode: string;
  children: ReactNode;
  fallback?: ReactNode;
  degradedFallback?: ReactNode;
}

/**
 * Composant qui protège un contenu en fonction de l'état d'un module
 * Affiche le contenu uniquement si le module est actif
 */
export const ModuleGuard: React.FC<ModuleGuardProps> = ({
  moduleCode,
  children,
  fallback,
  degradedFallback
}) => {
  const { 
    getModuleActiveStatus, 
    getModuleDegradedStatus 
  } = useModuleApiContext();

  // Vérifier si c'est un module Admin - toujours retourner le contenu
  const isAdminModule = moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin');
  
  // Si c'est un module Admin, toujours afficher le contenu
  if (isAdminModule) {
    return <>{children}</>;
  }

  // Vérifier si le module est actif
  const isActive = getModuleActiveStatus(moduleCode);
  
  // Vérifier si le module est dégradé
  const isDegraded = getModuleDegradedStatus(moduleCode);

  if (!isActive) {
    // Si le module n'est pas actif, afficher le fallback
    return fallback ? <>{fallback}</> : <ModuleUnavailable moduleCode={moduleCode} />;
  }

  if (isDegraded) {
    // Si le module est dégradé, afficher le degradedFallback
    return degradedFallback ? <>{degradedFallback}</> : <ModuleDegraded moduleCode={moduleCode} />;
  }

  // Si le module est actif et non dégradé, afficher le contenu
  return <>{children}</>;
};

export default ModuleGuard;
