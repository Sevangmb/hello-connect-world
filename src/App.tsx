
import { Suspense, lazy, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { moduleOptimizer } from '@/services/performance/ModuleOptimizer';
import { AdminLoginBypass } from '@/components/admin/AdminLoginBypass';
import { useToast } from '@/hooks/use-toast';
import { ErrorBoundary } from '@/components/ErrorBoundary';

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

export type ModuleStatus = 'active' | 'inactive' | 'degraded' | 'maintenance';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

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

    // Gérer les erreurs de route non trouvée
    const handleRouteError = () => {
      const invalidRoutes = ['/undefined', '/null', '/[object%20Object]'];
      if (invalidRoutes.includes(location.pathname)) {
        console.error('Route invalide détectée:', location.pathname);
        toast({
          variant: "destructive",
          title: "Erreur de navigation",
          description: "URL invalide détectée. Redirection vers la page d'accueil."
        });
        navigate('/', { replace: true });
      }
    };

    handleRouteError();
  }, [location.pathname, navigate, toast]);
  
  return (
    <ErrorBoundary fallback={
      <div className="flex h-screen w-full flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Une erreur est survenue</h2>
        <p className="mb-6">L'application a rencontré un problème inattendu.</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          Rafraîchir la page
        </button>
      </div>
    }>
      <Suspense fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <div className="flex flex-col items-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-muted-foreground">Chargement en cours...</p>
          </div>
        </div>
      }>
        <Routes>
          <Route path="/*" element={<MainRoutes />} />
        </Routes>
      </Suspense>
      
      {/* Afficher le bouton de bypass admin en mode développement */}
      {process.env.NODE_ENV === 'development' && <AdminLoginBypass />}
    </ErrorBoundary>
  );
}
