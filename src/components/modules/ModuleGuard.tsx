
import React, { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModuleRegistry } from '@/hooks/modules/useModuleRegistry';
import ModuleUnavailable from './ModuleUnavailable';
import ModuleDegraded from './ModuleDegraded';
import { Loader2 } from 'lucide-react';

interface ModuleGuardProps {
  moduleCode: string;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Composant qui vérifie si un module est disponible avant d'afficher son contenu
 */
export const ModuleGuard: React.FC<ModuleGuardProps> = ({ 
  moduleCode, 
  children, 
  fallback 
}) => {
  const navigate = useNavigate();
  const { modules, loading, error, isModuleDegraded } = useModuleRegistry();
  const [moduleActive, setModuleActive] = useState<boolean | null>(null);
  const [moduleDegraded, setModuleDegraded] = useState<boolean>(false);
  const [checkingStatus, setCheckingStatus] = useState<boolean>(true);

  useEffect(() => {
    const checkModuleStatus = async () => {
      setCheckingStatus(true);
      
      // Vérifier si le module existe dans la liste
      const module = modules.find(m => m.code === moduleCode);
      
      if (module) {
        setModuleActive(module.status === 'active');
        
        // Vérifier si le module est en dégradation
        try {
          const isDegraded = await isModuleDegraded(module.id);
          setModuleDegraded(isDegraded);
        } catch (err) {
          console.error(`Error checking if module ${moduleCode} is degraded:`, err);
          setModuleDegraded(false);
        }
      } else {
        setModuleActive(false);
      }
      
      setCheckingStatus(false);
    };
    
    if (!loading && modules.length > 0) {
      checkModuleStatus();
    }
  }, [moduleCode, modules, loading, isModuleDegraded]);

  // Afficher un loader pendant la vérification
  if (loading || checkingStatus) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Si le module n'est pas actif, afficher un message ou rediriger
  if (moduleActive === false) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <ModuleUnavailable moduleCode={moduleCode} />;
  }

  // Si le module est dégradé, afficher un avertissement
  if (moduleDegraded) {
    return (
      <>
        <ModuleDegraded moduleCode={moduleCode} />
        {children}
      </>
    );
  }

  // Si tout est bon, afficher le contenu du module
  return <>{children}</>;
};

export default ModuleGuard;
