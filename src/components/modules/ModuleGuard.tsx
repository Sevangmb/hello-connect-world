
import React, { useEffect, useState } from "react";
import { useModules } from "@/hooks/useModules";

interface ModuleGuardProps {
  moduleCode: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
  strictMode?: boolean; // En mode strict, vérifie aussi les dépendances
}

/**
 * Composant qui vérifie si un module est actif avant d'afficher son contenu
 * Version améliorée pour l'architecture microservices
 */
export const ModuleGuard: React.FC<ModuleGuardProps> = ({
  moduleCode,
  fallback,
  children,
  loadingComponent,
  strictMode = false,
}) => {
  const { isModuleActive } = useModules();
  const [isActive, setIsActive] = useState(false);
  const [checked, setChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkModule = async () => {
      setIsLoading(true);
      
      try {
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
          
          // Si en mode strict et que le module est actif, on vérifie aussi les dépendances
          if (strictMode && active) {
            // TODO: Ajouter la vérification des dépendances du module
            // Cette fonctionnalité serait implémentée avec le ModuleValidator
          }
        }
      } catch (error) {
        console.error(`Erreur lors de la vérification du module ${moduleCode}:`, error);
        setIsActive(false);
      } finally {
        setChecked(true);
        setIsLoading(false);
      }
    };
    
    checkModule();
  }, [moduleCode, isModuleActive, strictMode]);

  // Afficher le composant de chargement pendant la vérification
  if (isLoading) {
    return <>{loadingComponent || null}</>;
  }
  
  // Si la vérification n'est pas terminée, ne rien afficher
  if (!checked) {
    return null;
  }
  
  // Afficher le contenu seulement si le module est actif
  if (isActive) {
    return <>{children}</>;
  }
  
  // Sinon, afficher le fallback ou rien
  return <>{fallback}</> || null;
};
