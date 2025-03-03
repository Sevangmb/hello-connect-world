
import React from "react";
import { useModules } from "@/hooks/modules";

interface ModuleGuardProps {
  moduleCode: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Composant qui vérifie si un module est actif avant d'afficher son contenu
 */
export const ModuleGuard: React.FC<ModuleGuardProps> = ({
  moduleCode,
  fallback,
  children,
}) => {
  const { isModuleActive, isModuleDegraded } = useModules();

  // Déterminer si le module est un module administrateur
  const isAdminModule = moduleCode === 'admin' || 
                         moduleCode.startsWith('admin_') || 
                         moduleCode === 'admin_modules';

  // Les modules admin sont toujours actifs
  if (isAdminModule) {
    return <>{children}</>;
  }

  // Pour les autres modules, vérifier s'ils sont actifs
  const isActive = isModuleActive(moduleCode);
  const isDegraded = isModuleDegraded(moduleCode);

  if (!isActive) {
    // Si le module n'est pas actif, afficher le fallback ou rien
    return fallback ? <>{fallback}</> : null;
  }

  if (isDegraded) {
    // Si le module est en mode dégradé, on affiche quand même le contenu
    // mais on pourrait ajouter un bandeau d'avertissement ici
    console.warn(`Module ${moduleCode} en mode dégradé`);
  }

  return <>{children}</>;
};
