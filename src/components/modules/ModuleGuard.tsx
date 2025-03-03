
import React, { useEffect, useState } from "react";
import { useModuleRegistry } from "@/hooks/modules/useModuleRegistry";
import { ModuleUnavailable } from "./ModuleUnavailable";
import { ModuleDegraded } from "./ModuleDegraded";

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
  const { isModuleActive, isModuleDegraded, initialized } = useModuleRegistry();
  const [isActive, setIsActive] = useState(false);
  const [isDegraded, setIsDegraded] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ne vérifier que si le module registry est initialisé
    if (initialized) {
      const checkModule = async () => {
        setIsLoading(true);
        
        try {
          // Déterminer si le module est un module administrateur
          const isAdminModule = moduleCode === 'admin' || 
                               moduleCode.startsWith('admin_');

          // Les modules admin sont toujours actifs
          if (isAdminModule) {
            setIsActive(true);
            setIsDegraded(false);
          } else {
            // Pour les autres modules, vérifier si le module est actif
            const active = isModuleActive(moduleCode);
            setIsActive(active);
            
            // Vérifier si le module est en mode dégradé
            if (active) {
              setIsDegraded(isModuleDegraded(moduleCode));
            } else {
              setIsDegraded(false);
            }
            
            // Si en mode strict, on pourrait ajouter des vérifications supplémentaires
            if (strictMode && active) {
              // Cette fonctionnalité serait implémentée avec vérification des dépendances
              // Pour l'instant, on utilise simplement l'état du module
            }
          }
        } catch (error) {
          console.error(`Erreur lors de la vérification du module ${moduleCode}:`, error);
          setIsActive(false);
          setIsDegraded(false);
        } finally {
          setIsChecked(true);
          setIsLoading(false);
        }
      };
      
      checkModule();
    }
  }, [moduleCode, isModuleActive, isModuleDegraded, strictMode, initialized]);

  // Forcer la fin du chargement après 3 secondes pour éviter un blocage indéfini
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        console.log(`ModuleGuard: Forcer la fin du chargement pour ${moduleCode} après timeout`);
        setIsLoading(false);
        setIsChecked(true);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [isLoading, moduleCode]);

  // Afficher le composant de chargement pendant la vérification
  if (isLoading) {
    return <>{loadingComponent || null}</>;
  }
  
  // Si la vérification n'est pas terminée, ne rien afficher
  if (!isChecked) {
    return null;
  }
  
  // Afficher le contenu en fonction de l'état du module
  if (isActive) {
    // Si le module est dégradé, afficher le composant spécifique
    if (isDegraded) {
      return (
        <>
          <ModuleDegraded moduleCode={moduleCode} />
          {children}
        </>
      );
    }
    
    // Si tout est normal, afficher le contenu
    return <>{children}</>;
  }
  
  // Si le module n'est pas actif, afficher le fallback ou le composant d'indisponibilité
  if (fallback) {
    return <>{fallback}</>;
  }
  
  // Afficher un message standard d'indisponibilité
  return <ModuleUnavailable moduleCode={moduleCode} />;
};
