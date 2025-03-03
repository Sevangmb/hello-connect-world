
/**
 * Composant d'initialisation des services de l'application
 * Initialise tous les services au démarrage de l'application
 */
import React, { useEffect, useState } from 'react';
import { moduleApiGateway } from '@/services/api-gateway/ModuleApiGateway';
import { eventBus } from '@/core/event-bus/EventBus';
import { SYSTEM_EVENTS } from '@/core/event-bus/events';
import { useToast } from '@/hooks/use-toast';

interface AppServicesProps {
  children: React.ReactNode;
}

export const AppServices: React.FC<AppServicesProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const startTime = performance.now();
    const initializedServices: string[] = [];
    
    // Fonction pour initialiser tous les services
    const initializeServices = async () => {
      try {
        // Initialiser le service de modules
        const moduleInitialized = await moduleApiGateway.initialize();
        if (moduleInitialized) {
          initializedServices.push('module');
        }
        
        // Ajouter ici l'initialisation d'autres services au fur et à mesure qu'ils sont implémentés
        // const authInitialized = await authApiGateway.initialize();
        // const notificationInitialized = await notificationApiGateway.initialize();
        // etc.
        
        // Marquer comme initialisé
        setIsInitialized(true);
        
        // Calculer la durée totale d'initialisation
        const duration = performance.now() - startTime;
        
        // Publier un événement d'initialisation
        eventBus.publish(SYSTEM_EVENTS.APP_INITIALIZED, {
          timestamp: Date.now(),
          duration,
          services: initializedServices
        });
        
        console.log(`Application initialisée en ${duration.toFixed(2)}ms`);
      } catch (err) {
        console.error("Erreur lors de l'initialisation des services:", err);
        setError(err instanceof Error ? err.message : String(err));
        
        // Publier un événement d'erreur
        eventBus.publish(SYSTEM_EVENTS.APP_ERROR, {
          error: err instanceof Error ? err.message : String(err),
          context: "initialization",
          timestamp: Date.now(),
          isFatal: true
        });
        
        toast({
          variant: "destructive",
          title: "Erreur d'initialisation",
          description: "Impossible d'initialiser tous les services de l'application."
        });
      }
    };
    
    initializeServices();
    
    // Nettoyage au démontage
    return () => {
      // Si nécessaire, ajouter ici des opérations de nettoyage
    };
  }, [toast]);

  if (error) {
    // En cas d'erreur fatale, afficher un message d'erreur
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur critique</h2>
          <p className="text-gray-700 mb-4">
            Une erreur est survenue lors de l'initialisation de l'application :
          </p>
          <div className="bg-red-50 p-4 rounded border border-red-200 text-red-800 font-mono text-sm mb-4">
            {error}
          </div>
          <p className="text-gray-600 text-sm">
            Veuillez rafraîchir la page ou contacter le support si le problème persiste.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Rafraîchir la page
          </button>
        </div>
      </div>
    );
  }

  // Afficher un chargement ou directement les enfants selon la politique de l'application
  return <>{children}</>;
};
