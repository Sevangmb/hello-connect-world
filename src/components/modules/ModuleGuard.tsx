
import React, { useEffect, useState } from "react";
import { useModuleRegistry } from "@/hooks/modules/useModuleRegistry";
import { ModuleUnavailable } from "./ModuleUnavailable";
import { ModuleDegraded } from "./ModuleDegraded";
import { eventBus } from "@/core/event-bus/EventBus";
import { MODULE_EVENTS } from "@/services/modules/ModuleEvents";
import { useMetrics } from "@/hooks/useMetrics";

interface ModuleGuardProps {
  moduleCode: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
  strictMode?: boolean; // En mode strict, vérifie aussi les dépendances
}

/**
 * Composant qui vérifie si un module est actif avant d'afficher son contenu
 * Version améliorée pour l'architecture microservices avec Event Bus
 */
export const ModuleGuard: React.FC<ModuleGuardProps> = ({
  moduleCode,
  fallback,
  children,
  loadingComponent,
  strictMode = false,
}) => {
  const { isModuleActive, isModuleDegraded, initialized } = useModuleRegistry();
  const { incrementCounter, measureOperation, startTimer, stopTimer } = useMetrics();
  const [isActive, setIsActive] = useState(false);
  const [isDegraded, setIsDegraded] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Enregistrer l'utilisation du ModuleGuard
    incrementCounter('module_guard.usage', 1, { moduleCode });
    
    const timerName = `module_guard.load.${moduleCode}`;
    const startTime = performance.now();
    
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
            incrementCounter('module_guard.admin_access', 1, { moduleCode });
          } else {
            // Pour les autres modules, vérifier si le module est actif
            const checkActivePromise = () => isModuleActive(moduleCode);
            const active = await measureOperation('module_check.active', checkActivePromise, { moduleCode });
            setIsActive(active);
            
            // Vérifier si le module est en mode dégradé
            if (active) {
              const checkDegradedPromise = () => isModuleDegraded(moduleCode);
              const degraded = await measureOperation('module_check.degraded', checkDegradedPromise, { moduleCode });
              setIsDegraded(degraded);
              
              // Suivre le statut du module
              incrementCounter('module_guard.status', 1, { 
                moduleCode, 
                status: degraded ? 'degraded' : 'active' 
              });
            } else {
              setIsDegraded(false);
              incrementCounter('module_guard.status', 1, { moduleCode, status: 'inactive' });
            }
            
            // Si en mode strict, on pourrait ajouter des vérifications supplémentaires
            if (strictMode && active) {
              // Cette fonctionnalité serait implémentée avec vérification des dépendances
              incrementCounter('module_guard.strict_mode', 1, { moduleCode });
            }
          }
        } catch (error) {
          console.error(`Erreur lors de la vérification du module ${moduleCode}:`, error);
          setIsActive(false);
          setIsDegraded(false);
          incrementCounter('module_guard.error', 1, { moduleCode, errorType: error.name });
        } finally {
          setIsChecked(true);
          setIsLoading(false);
          
          // Enregistrer le temps de chargement
          const loadTime = performance.now() - startTime;
          incrementCounter('module_guard.load_time', loadTime, { moduleCode });
        }
      };
      
      checkModule();
      
      // S'abonner aux événements de changement de statut des modules
      const unsubscribe = eventBus.subscribe(MODULE_EVENTS.MODULE_STATUS_CHANGED, (event) => {
        if (event.moduleCode === moduleCode) {
          incrementCounter('module_guard.status_change_event', 1, { moduleCode });
          checkModule();
        }
      });
      
      return () => {
        unsubscribe();
      };
    }
  }, [moduleCode, isModuleActive, isModuleDegraded, strictMode, initialized, incrementCounter, measureOperation]);

  // Forcer la fin du chargement après 3 secondes pour éviter un blocage indéfini
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        console.log(`ModuleGuard: Forcer la fin du chargement pour ${moduleCode} après timeout`);
        setIsLoading(false);
        setIsChecked(true);
        incrementCounter('module_guard.timeout', 1, { moduleCode });
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [isLoading, moduleCode, incrementCounter]);

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
