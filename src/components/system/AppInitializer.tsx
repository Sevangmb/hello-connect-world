
import { useEffect, useState } from "react";
import { initializeModuleSystem } from "@/services/modules/ModuleInitializer";
import { eventBus } from "@/core/event-bus/EventBus";
import { MODULE_EVENTS } from "@/services/modules/ModuleEvents";

interface AppInitializerProps {
  children: React.ReactNode;
}

/**
 * Composant qui initialise les services de l'application au démarrage
 */
export const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialiser le système de modules
        const success = await initializeModuleSystem();
        
        if (!success) {
          setError("Erreur lors de l'initialisation des modules");
        }
        
        // S'abonner aux erreurs des modules
        const unsubscribe = eventBus.subscribe(MODULE_EVENTS.MODULE_ERROR, (event) => {
          console.error("Erreur du système de modules:", event.error, "Contexte:", event.context);
          // On pourrait afficher une notification ici
        });
        
        setInitialized(true);
        
        return () => {
          unsubscribe();
        };
      } catch (err) {
        console.error("Exception lors de l'initialisation de l'application:", err);
        setError("Erreur lors de l'initialisation de l'application");
        setInitialized(true); // Passer à true pour éviter le blocage
      }
    };
    
    initialize();
  }, []);

  if (!initialized) {
    // Afficher un écran de chargement pendant l'initialisation
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold">Initialisation de l'application...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    // Afficher une erreur mais laisser l'application continuer
    return (
      <>
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p className="font-bold">Erreur d'initialisation</p>
          <p>{error}</p>
          <p className="text-sm">Certaines fonctionnalités pourraient ne pas être disponibles.</p>
        </div>
        {children}
      </>
    );
  }

  // Tout est initialisé, afficher l'application
  return <>{children}</>;
};
