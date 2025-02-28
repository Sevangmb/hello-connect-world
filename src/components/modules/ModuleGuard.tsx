
import React, { useEffect, useState } from "react";
import { useModules } from "@/hooks/modules";
import { getModuleStatusesFromCache } from "@/hooks/modules/utils";
import { ModuleStatus } from "@/hooks/modules/types";

interface ModuleGuardProps {
  moduleCode: string;
  fallback?: React.ReactNode;
  degradedView?: React.ReactNode;
  children: React.ReactNode;
  loadingView?: React.ReactNode;
  debug?: boolean;
}

export const ModuleGuard: React.FC<ModuleGuardProps> = ({ 
  moduleCode, 
  fallback = null, 
  degradedView = null,
  loadingView = null,
  children,
  debug = false
}) => {
  const { isModuleActive, isModuleDegraded, loading } = useModules();
  const [moduleActive, setModuleActive] = useState<boolean | null>(null);
  const [moduleDegraded, setModuleDegraded] = useState<boolean | null>(null);

  // Vérifier le cache local au montage
  useEffect(() => {
    const checkCache = () => {
      const cache = getModuleStatusesFromCache();
      if (cache && cache[moduleCode]) {
        setModuleActive(cache[moduleCode] === 'active');
        setModuleDegraded(cache[moduleCode] === 'degraded');
      } else {
        // Si pas de cache, utiliser les valeurs de useModules
        setModuleActive(isModuleActive(moduleCode));
        setModuleDegraded(isModuleDegraded(moduleCode));
      }
    };

    checkCache();
    
    // Écouter les événements de mise à jour des modules
    const handleModuleChange = () => {
      checkCache();
    };
    
    window.addEventListener('module_status_changed', handleModuleChange);
    window.addEventListener('app_modules_updated', handleModuleChange);
    
    return () => {
      window.removeEventListener('module_status_changed', handleModuleChange);
      window.removeEventListener('app_modules_updated', handleModuleChange);
    };
  }, [moduleCode, isModuleActive, isModuleDegraded]);

  // Mettre à jour l'état quand les valeurs de useModules changent
  useEffect(() => {
    if (!loading) {
      setModuleActive(isModuleActive(moduleCode));
      setModuleDegraded(isModuleDegraded(moduleCode));
    }
  }, [loading, isModuleActive, isModuleDegraded, moduleCode]);

  // Afficher des informations de débogage si demandé
  if (debug && moduleActive !== null) {
    console.debug(`ModuleGuard [${moduleCode}]:`, {
      isActive: moduleActive,
      isDegraded: moduleDegraded
    });
  }

  // Pendant le chargement, afficher la vue de chargement ou rien
  if (loading && moduleActive === null) return <>{loadingView}</>;

  // Si le module est actif
  if (moduleActive) {
    return <>{children}</>;
  }

  // Si le module est en mode dégradé et qu'il y a une vue dégradée
  if (moduleDegraded && degradedView) {
    return <>{degradedView}</>;
  }

  // Si le module est inactif ou en mode dégradé sans vue dégradée
  return <>{fallback}</>;
};

export default ModuleGuard;
