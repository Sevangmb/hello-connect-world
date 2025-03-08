
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ModuleUnavailable } from './ModuleUnavailable';
import { useModuleRegistry } from '@/hooks/modules/useModuleRegistry';
import { LoadingSpinner } from '../ui/loading-spinner';
import { eventBus } from '@/core/event-bus/EventBus';
import { EVENTS } from '@/core/event-bus/constants';

interface ModuleGuardProps {
  children: React.ReactNode;
  moduleCode: string;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export const ModuleGuard: React.FC<ModuleGuardProps> = ({
  children,
  moduleCode,
  fallback,
  redirectTo,
}) => {
  const { modules, loading, initialized, isModuleActive } = useModuleRegistry();
  const [isActive, setIsActive] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkModuleStatus = async () => {
      if (!initialized) return;
      
      try {
        setIsChecking(true);
        const active = await isModuleActive(moduleCode);
        setIsActive(active);
        
        // Publier un événement de statut de module
        eventBus.publish(EVENTS.MODULE.STATUS_CHANGED, {
          moduleCode,
          active,
          timestamp: Date.now()
        });
      } catch (error) {
        console.error(`Error checking module status for ${moduleCode}:`, error);
        setIsActive(false);
        
        // Publier un événement d'erreur
        eventBus.publish(EVENTS.SYSTEM.ERROR, {
          source: 'ModuleGuard',
          moduleCode,
          error: error instanceof Error ? error.message : String(error),
          timestamp: Date.now()
        });
      } finally {
        setIsChecking(false);
      }
    };

    if (initialized) {
      checkModuleStatus();
    }
  }, [moduleCode, initialized, isModuleActive]);

  // Si les modules sont en cours de chargement ou si le statut est en vérification
  if (loading || isChecking) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Si le module n'est pas actif
  if (isActive === false) {
    // Publier un événement de module non disponible
    eventBus.publish(EVENTS.MODULE.FEATURE_DISABLED, {
      moduleCode,
      timestamp: Date.now()
    });
    
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }

    if (fallback) {
      return <>{fallback}</>;
    }

    return <ModuleUnavailable moduleCode={moduleCode} />;
  }

  // Module actif, rendre le contenu
  eventBus.publish(EVENTS.MODULE.FEATURE_ENABLED, {
    moduleCode,
    timestamp: Date.now()
  });
  
  return <>{children}</>;
};
