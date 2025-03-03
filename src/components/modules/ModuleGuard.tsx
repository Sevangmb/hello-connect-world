
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
  const { isModuleActive } = useModules();

  // Déterminer si le module est un module administrateur
  const isAdminModule = moduleCode === 'admin' || 
                         moduleCode.startsWith('admin_');

  // Les modules admin sont toujours actifs
  if (isAdminModule) {
    return <>{children}</>;
  }

  // Pour les autres modules, vérifier si le module est actif
  const isActive = isModuleActive(moduleCode);
  
  // Afficher le contenu seulement si le module est actif
  if (isActive) {
    return <>{children}</>;
  }
  
  // Sinon, afficher le fallback ou rien
  return <>{fallback}</> || null;
};
