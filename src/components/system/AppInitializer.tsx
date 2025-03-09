
import React, { useEffect, useState, useCallback } from 'react';
import { moduleOptimizer } from '@/services/performance/ModuleOptimizer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface AppInitializerProps {
  children: React.ReactNode;
}

export const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [initStartTime] = useState(performance.now());
  const [progress, setProgress] = useState(0);

  // Initialisation optimisée avec suivi de progression
  const initializeApp = useCallback(async () => {
    // Mesurer le temps de démarrage
    const startTime = performance.now();
    
    try {
      // Précharger les modules prioritaires avec progression
      setProgress(10);
      await moduleOptimizer.preloadPriorityModules();
      setProgress(70);
      
      // Précharger les ressources statiques
      await Promise.all([
        // Préchargement des images et ressources les plus utilisées
        new Promise(resolve => {
          const img = new Image();
          img.src = '/placeholder.svg';
          img.onload = resolve;
          img.onerror = resolve; // Continue même en cas d'erreur
        }),
      ]);
      
      setProgress(90);
      
      // Mesurer et enregistrer les performances
      const endTime = performance.now();
      console.log(`Initialisation terminée en ${Math.round(endTime - startTime)}ms`);
      
      // Enregistrer les métriques de performance
      if (window.performance && 'measure' in window.performance) {
        window.performance.mark('app-init-end');
        window.performance.measure('app-initialization', 'app-init-start', 'app-init-end');
      }
      
      setProgress(100);
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
      // Continuer malgré l'erreur pour ne pas bloquer l'utilisateur
      setProgress(100);
    }
  }, []);

  useEffect(() => {
    // Marquer le début de l'initialisation
    if (window.performance && 'mark' in window.performance) {
      window.performance.mark('app-init-start');
    }
    
    // Initialiser l'application
    initializeApp();
    
    // Délai minimal pour éviter le flash de contenu
    const minDisplayTime = 300;
    const elapsedTime = performance.now() - initStartTime;
    const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
    
    // Finaliser l'initialisation après le délai minimal
    const timer = setTimeout(() => {
      setInitialized(true);
    }, remainingTime);
    
    return () => clearTimeout(timer);
  }, [initStartTime, initializeApp]);

  if (!initialized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-muted-foreground">Chargement de l'application...</p>
          <div className="w-64 h-1 bg-gray-200 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
