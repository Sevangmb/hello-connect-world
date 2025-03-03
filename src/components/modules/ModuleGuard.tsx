
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
                         moduleCode.startsWith('admin_');

  // Les modules admin sont toujours actifs
  if (isAdminModule) {
    return <>{children}</>;
  }

  // Pour les autres modules, toujours afficher le contenu car tous les modules
  // sont considérés comme actifs dans notre implémentation actuelle
  return <>{children}</>;
};
