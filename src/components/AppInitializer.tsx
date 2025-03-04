
import React, { useEffect, useState } from 'react';
import { moduleOptimizer } from '@/services/performance/ModuleOptimizer';

interface AppInitializerProps {
  children: React.ReactNode;
}

export const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Mesurer le temps de démarrage
    const startTime = performance.now();
    
    // Précharger les modules prioritaires
    moduleOptimizer.preloadPriorityModules();
    
    // Mesurer et enregistrer les performances
    const endTime = performance.now();
    console.log(`Initialisation rapide terminée en ${Math.round(endTime - startTime)}ms`);
    
    setInitialized(true);
  }, []);

  if (!initialized) {
    return null; // Ou un écran de chargement très léger si nécessaire
  }

  return <>{children}</>;
};
