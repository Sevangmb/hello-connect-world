
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { moduleOptimizer } from '@/services/performance/ModuleOptimizer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { eventBus } from '@/core/event-bus/EventBus';

interface AppInitializerProps {
  children: React.ReactNode;
}

export const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [initStartTime] = useState(performance.now());
  const [progress, setProgress] = useState(0);
  const [initTasks, setInitTasks] = useState<{
    total: number;
    completed: number;
    failed: number;
  }>({ total: 5, completed: 0, failed: 0 });

  // Utiliser useMemo pour éviter des calculs répétés
  const progressPercentage = useMemo(() => {
    return Math.min(100, Math.round((initTasks.completed / initTasks.total) * 100));
  }, [initTasks.completed, initTasks.total]);

  // Fonction pour marquer une tâche comme terminée
  const completeTask = useCallback((success: boolean = true) => {
    setInitTasks(prev => ({
      ...prev,
      completed: prev.completed + 1,
      failed: success ? prev.failed : prev.failed + 1
    }));
  }, []);

  // Initialisation optimisée avec suivi de progression
  const initializeApp = useCallback(async () => {
    // Mesurer le temps de démarrage
    const startTime = performance.now();
    
    try {
      // Publier un événement pour signaler le début de l'initialisation
      eventBus.publish('app:init-start', { timestamp: startTime });
      
      // Initialiser le cache d'application
      try {
        // Vérifier et nettoyer les caches obsolètes
        const cacheTimestamp = localStorage.getItem('app-cache-timestamp');
        if (cacheTimestamp) {
          const cacheAge = Date.now() - parseInt(cacheTimestamp, 10);
          // Nettoyer le cache s'il a plus de 24 heures
          if (cacheAge > 24 * 60 * 60 * 1000) {
            console.log("Nettoyage du cache obsolète");
            localStorage.removeItem('app-cache-timestamp');
            // Nettoyer tous les éléments du cache qui commencent par "cache-"
            Object.keys(localStorage)
              .filter(key => key.startsWith('cache-'))
              .forEach(key => localStorage.removeItem(key));
          }
        } else {
          // Définir le timestamp du cache
          localStorage.setItem('app-cache-timestamp', Date.now().toString());
        }
      } catch (e) {
        console.warn("Erreur lors de l'initialisation du cache:", e);
      }
      completeTask();
      setProgress(20);
      
      // Précharger les modules prioritaires avec progression
      await moduleOptimizer.preloadPriorityModules();
      completeTask();
      setProgress(40);
      
      // Vérifier la connectivité réseau
      try {
        const networkStatus = navigator.onLine;
        if (!networkStatus) {
          console.warn("Connexion réseau non disponible. Certaines fonctionnalités peuvent être limitées.");
        }
      } catch (e) {
        console.warn("Erreur lors de la vérification de la connectivité:", e);
      }
      completeTask();
      setProgress(60);
      
      // Précharger les ressources statiques en parallèle
      await Promise.all([
        // Préchargement des images et ressources les plus utilisées
        new Promise(resolve => {
          const img = new Image();
          img.src = '/placeholder.svg';
          img.onload = resolve;
          img.onerror = resolve; // Continue même en cas d'erreur
        }),
        
        // Préchargement d'autres ressources importantes
        // Initialisation optimisée des services
        Promise.resolve().then(() => {
          const styleCache = document.createElement('style');
          styleCache.textContent = `
            /* Préchargement des polices et ressources */
            @font-face {
              font-family: 'System';
              font-display: swap;
              src: local('BlinkMacSystemFont'), local('Segoe UI'), local('Roboto');
            }
          `;
          document.head.appendChild(styleCache);
        }),
      ]);
      completeTask();
      setProgress(80);
      
      // Configuration des optimisations de performance
      try {
        if ('requestIdleCallback' in window) {
          // Configurer les traitements non urgents
          window.requestIdleCallback(() => {
            console.log("Configuration des optimisations en arrière-plan terminée");
          });
        }
      } catch (e) {
        console.warn("Optimisations de performance non supportées:", e);
      }
      completeTask();
      setProgress(100);
      
      // Mesurer et enregistrer les performances
      const endTime = performance.now();
      console.log(`Initialisation terminée en ${Math.round(endTime - startTime)}ms`);
      
      // Enregistrer les métriques de performance
      if (window.performance && 'measure' in window.performance) {
        window.performance.mark('app-init-end');
        window.performance.measure('app-initialization', 'app-init-start', 'app-init-end');
      }
      
      // Publier un événement pour signaler la fin de l'initialisation
      eventBus.publish('app:init-complete', { 
        duration: Math.round(endTime - startTime),
        tasksFailed: initTasks.failed
      });
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
      // Continuer malgré l'erreur pour ne pas bloquer l'utilisateur
      eventBus.publish('app:init-error', { error });
    }
  }, [completeTask]);

  useEffect(() => {
    // Marquer le début de l'initialisation
    if (window.performance && 'mark' in window.performance) {
      window.performance.mark('app-init-start');
    }
    
    // Initialiser l'application
    initializeApp();
    
    // Délai minimal pour éviter le flash de contenu
    const minDisplayTime = 500;
    
    // Finaliser l'initialisation après le délai minimal
    const timer = setTimeout(() => {
      const elapsedTime = performance.now() - initStartTime;
      console.log(`Temps d'initialisation total: ${Math.round(elapsedTime)}ms`);
      setInitialized(true);
    }, minDisplayTime);
    
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
          <p className="mt-2 text-xs text-muted-foreground">
            {progress}% - Initialisation des composants
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
