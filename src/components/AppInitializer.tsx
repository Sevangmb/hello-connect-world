
import React, { useEffect, useState, useRef } from 'react';
import { moduleOptimizer } from '@/services/performance/ModuleOptimizer';
import { LoadingSpinner } from './ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import { useModuleRegistry } from '@/hooks/modules/useModuleRegistry';

interface AppInitializerProps {
  children: React.ReactNode;
}

export const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const { initialized, loading, initializeModules } = useModuleRegistry();
  const [initStartTime] = useState(performance.now());
  const [displayLoading, setDisplayLoading] = useState(true);
  const { toast } = useToast();
  const initAttemptedRef = useRef(false);

  useEffect(() => {
    // Éviter les initialisation multiples
    if (initAttemptedRef.current) return;
    initAttemptedRef.current = true;
    
    // Mesurer le temps de démarrage
    const startTime = performance.now();
    
    // Initialiser les modules
    const init = async () => {
      try {
        await initializeModules();
        
        // Précharger les modules prioritaires avec un délai
        setTimeout(() => {
          moduleOptimizer.preloadPriorityModules();
        }, 500);
      } catch (error) {
        console.error('Erreur durant l\'initialisation:', error);
        toast({
          variant: "destructive",
          title: "Erreur d'initialisation",
          description: "L'application n'a pas pu démarrer correctement. Veuillez rafraîchir la page.",
        });
      }
    };
    
    init();
    
    // Mesurer et enregistrer les performances
    const endTime = performance.now();
    console.log(`Initialisation rapide terminée en ${Math.round(endTime - startTime)}ms`);
    
    // Délai minimal pour éviter le flash de contenu
    const minDisplayTime = 300;
    const elapsedTime = performance.now() - initStartTime;
    const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
    
    // Force hide loading after max 3 seconds, even if modules aren't ready
    const maxLoadingTime = 3000;
    
    // Finaliser l'initialisation après le délai minimal
    setTimeout(() => {
      setDisplayLoading(false);
    }, Math.min(remainingTime, maxLoadingTime));
  }, [initStartTime, initializeModules, toast]);

  if (loading || displayLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-muted-foreground">Chargement de l'application...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
