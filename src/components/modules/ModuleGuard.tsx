
import React, { useEffect, useState } from "react";
import { useModules } from "@/hooks/useModules";

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
  const [isActive, setIsActive] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const checkModule = async () => {
      // Déterminer si le module est un module administrateur
      const isAdminModule = moduleCode === 'admin' || 
                           moduleCode.startsWith('admin_');

      // Les modules admin sont toujours actifs
      if (isAdminModule) {
        setIsActive(true);
      } else {
        // Pour les autres modules, vérifier si le module est actif
        const active = await isModuleActive(moduleCode);
        setIsActive(active);
      }
      setChecked(true);
    };
    
    checkModule();
  }, [moduleCode, isModuleActive]);

  if (!checked) {
    return null; // Ou un indicateur de chargement si nécessaire
  }
  
  // Afficher le contenu seulement si le module est actif
  if (isActive) {
    return <>{children}</>;
  }
  
  // Sinon, afficher le fallback ou rien
  return <>{fallback}</> || null;
};
