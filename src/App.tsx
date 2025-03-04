
import { Suspense, lazy, useEffect } from 'react';
import { Routes } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { moduleOptimizer } from '@/services/performance/ModuleOptimizer';

// Utiliser lazy loading pour les routes principales
const MainRoutes = lazy(() => import('./routes/MainRoutes'));

// Préchargement des ressources critiques
const preloadCriticalResources = () => {
  // Précharger les images critiques
  const preloadImage = (src: string) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  };
  
  // Logo et images principales
  preloadImage('/lovable-uploads/9a2d6f53-d074-4690-bd16-a9c6c1e5f3c5.png');
};

export default function App() {
  useEffect(() => {
    // Précharger les ressources critiques
    preloadCriticalResources();
    
    // Précharger les modules prioritaires
    moduleOptimizer.preloadPriorityModules();
    
    // Mesurer le time-to-interactive
    const tti = performance.now();
    console.log(`Time to interactive: ${Math.round(tti)}ms`);
    
    // Enregistrer les métriques de performance
    window.addEventListener('load', () => {
      if ('performance' in window) {
        const perfEntries = performance.getEntriesByType('navigation');
        if (perfEntries.length > 0) {
          const timing = perfEntries[0] as PerformanceNavigationTiming;
          console.log(`Temps de chargement DOM: ${Math.round(timing.domComplete)}ms`);
          console.log(`Temps de chargement complet: ${Math.round(timing.loadEventEnd)}ms`);
        }
      }
    });
  }, []);
  
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-muted-foreground">Chargement en cours...</p>
        </div>
      </div>
    }>
      <Routes>
        <MainRoutes />
      </Routes>
    </Suspense>
  );
}
