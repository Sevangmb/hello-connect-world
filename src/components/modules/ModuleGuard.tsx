
import React, { useEffect, useState } from "react";
import { useModuleRegistry } from "@/hooks/modules/useModuleRegistry";
import { ModuleUnavailable } from "./ModuleUnavailable";
import { ModuleDegraded } from "./ModuleDegraded";
import { eventBus } from "@/core/event-bus/EventBus";
import { MODULE_EVENTS } from "@/services/modules/ModuleEvents";
import { useMetrics } from "@/hooks/useMetrics";
import { Loader2 } from 'lucide-react';
import { moduleMenuCoordinator } from "@/services/coordination/ModuleMenuCoordinator";

interface ModuleGuardProps {
  moduleCode: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
  strictMode?: boolean; // En mode strict, vérifie aussi les dépendances
  errorComponent?: React.ReactNode; // Nouveau: composant pour les erreurs
}

const DefaultLoadingComponent = () => (
  <div className="flex items-center justify-center p-4 h-full min-h-[100px] w-full text-gray-400">
    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
    <span>Chargement du module...</span>
  </div>
);

/**
 * Composant qui vérifie si un module est actif avant d'afficher son contenu
 * Version améliorée avec coordination des menus
 */
export const ModuleGuard: React.FC<ModuleGuardProps> = ({
  moduleCode,
  fallback,
  children,
  loadingComponent,
  strictMode = false,
  errorComponent,
}) => {
  const { isModuleActive, isModuleDegraded, initialized, loading: registryLoading, error: registryError } = useModuleRegistry();
  const { incrementCounter, measureOperation } = useMetrics();
  const [isActive, setIsActive] = useState(false);
  const [isDegraded, setIsDegraded] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(0);

  useEffect(() => {
    // Enregistrer l'utilisation du ModuleGuard
    incrementCounter('module_guard.usage', 1, { moduleCode });
    
    const currentStartTime = performance.now();
    setStartTime(currentStartTime);
    
    // Ne vérifier que si le module registry est initialisé
    if (initialized) {
      const checkModule = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
          // Déterminer si le module est un module administrateur
          const isAdminModule = moduleCode === 'admin' || 
                               moduleCode.startsWith('admin_');

          // Les modules admin sont toujours actifs si l'utilisateur est admin
          if (isAdminModule && moduleMenuCoordinator.isAdminAccessEnabled()) {
            setIsActive(true);
            setIsDegraded(false);
            incrementCounter('module_guard.admin_access', 1, { moduleCode });
          } else {
            // Pour les autres modules, vérifier si le module est actif
            const checkActivePromise = async () => await isModuleActive(moduleCode);
            const active = await measureOperation('module_check.active', checkActivePromise, { moduleCode });
            setIsActive(!!active);
            
            // Vérifier si le module est en mode dégradé
            if (active) {
              const checkDegradedPromise = async () => await isModuleDegraded(moduleCode);
              const degraded = await measureOperation('module_check.degraded', checkDegradedPromise, { moduleCode });
              setIsDegraded(!!degraded);
              
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
        } catch (error: any) {
          console.error(`Erreur lors de la vérification du module ${moduleCode}:`, error);
          setIsActive(false);
          setIsDegraded(false);
          setError(error?.message || 'Erreur inconnue lors de la vérification du module');
          incrementCounter('module_guard.error', 1, { 
            moduleCode, 
            errorType: error?.name || 'unknown' 
          });
          
          // Publier un événement d'erreur
          eventBus.publish(MODULE_EVENTS.MODULE_ERROR, {
            error: `Erreur lors de la vérification du module ${moduleCode}`,
            context: 'module_guard',
            moduleCode,
            timestamp: Date.now(),
            details: error
          });
        } finally {
          setIsChecked(true);
          setIsLoading(false);
          const endTime = performance.now();
          const duration = endTime - startTime;
          
          // Enregistrer le temps de chargement comme histogramme pour les analyses
          incrementCounter('module_guard.load_time', duration, { moduleCode });
        }
      };
      
      checkModule();
      
      // S'abonner aux événements de changement de statut des modules et d'accès admin
      const unsubscribeModuleStatus = eventBus.subscribe(MODULE_EVENTS.MODULE_STATUS_CHANGED, (event) => {
        if (event.moduleCode === moduleCode) {
          incrementCounter('module_guard.status_change_event', 1, { moduleCode });
          checkModule();
        }
      });
      
      const unsubscribeAdminAccess = eventBus.subscribe('module_menu:admin_access_granted', () => {
        if (moduleCode === 'admin' || moduleCode.startsWith('admin_')) {
          checkModule();
        }
      });
      
      const unsubscribeAdminRevoked = eventBus.subscribe('module_menu:admin_access_revoked', () => {
        if (moduleCode === 'admin' || moduleCode.startsWith('admin_')) {
          checkModule();
        }
      });
      
      return () => {
        unsubscribeModuleStatus();
        unsubscribeAdminAccess();
        unsubscribeAdminRevoked();
      };
    }
  }, [moduleCode, isModuleActive, isModuleDegraded, strictMode, initialized, incrementCounter, measureOperation, startTime]);

  // Forcer la fin du chargement après 3 secondes pour éviter un blocage indéfini
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        console.log(`ModuleGuard: Forcer la fin du chargement pour ${moduleCode} après timeout`);
        setIsLoading(false);
        setIsChecked(true);
        
        // Si nous n'avons toujours pas de résultat, considérer comme une erreur
        if (!isChecked) {
          setError(`Le temps de vérification du module ${moduleCode} a expiré`);
        }
        
        incrementCounter('module_guard.timeout', 1, { moduleCode });
        
        // Publier un événement d'avertissement
        eventBus.publish(MODULE_EVENTS.MODULE_WARNING, {
          warning: `Timeout lors de la vérification du module ${moduleCode}`,
          context: 'module_guard',
          moduleCode,
          timestamp: Date.now()
        });
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [isLoading, moduleCode, incrementCounter, isChecked]);

  // Afficher le composant de chargement pendant la vérification
  if (isLoading) {
    return <>{loadingComponent || <DefaultLoadingComponent />}</>;
  }
  
  // Si une erreur s'est produite et qu'un composant d'erreur a été fourni
  if (error || registryError) {
    if (errorComponent) {
      return <>{errorComponent}</>;
    }
    
    // Sinon, afficher un message d'erreur simple
    return (
      <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded">
        <p className="font-medium">Erreur lors du chargement du module</p>
        <p className="text-sm mt-1">{error || registryError}</p>
      </div>
    );
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
