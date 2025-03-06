
import React, { useEffect, useState } from 'react';
import { moduleOptimizer } from '@/services/performance/ModuleOptimizer';
import { LoadingSpinner } from './ui/loading-spinner';
import { useAppInitializer } from '@/utils/AppInitializer';

interface AppInitializerProps {
  children: React.ReactNode;
}

export const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const { initialized, loading } = useAppInitializer();
  const [initStartTime] = useState(performance.now());
  const [displayLoading, setDisplayLoading] = useState(true);

  useEffect(() => {
    // Mesurer le temps de démarrage
    const startTime = performance.now();
    
    // Précharger les modules prioritaires
    moduleOptimizer.preloadPriorityModules();
    
    // Mesurer et enregistrer les performances
    const endTime = performance.now();
    console.log(`Initialisation rapide terminée en ${Math.round(endTime - startTime)}ms`);
    
    // Délai minimal pour éviter le flash de contenu
    const minDisplayTime = 300;
    const elapsedTime = performance.now() - initStartTime;
    const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
    
    // Finaliser l'initialisation après le délai minimal
    setTimeout(() => {
      setDisplayLoading(false);
    }, remainingTime);
  }, [initStartTime]);

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
