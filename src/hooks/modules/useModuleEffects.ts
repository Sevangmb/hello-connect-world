
import { useEffect, useRef } from 'react';
import { AppModule } from './types';

/**
 * Manages side effects for module data
 */
export const useModuleEffects = (
  modules: AppModule[], 
  setModules: React.Dispatch<React.SetStateAction<AppModule[]>>, 
  fetchModules: () => Promise<AppModule[]>,
  fetchDependencies: () => Promise<any[]>,
  fetchFeatures: () => Promise<Record<string, Record<string, boolean>>>
) => {
  const isLoadingRef = useRef(false);
  const initialLoadCompletedRef = useRef(false);
  
  // Initial load effect
  useEffect(() => {
    // Éviter les chargements multiples
    if (initialLoadCompletedRef.current || isLoadingRef.current) return;
    isLoadingRef.current = true;
    
    const loadData = async () => {
      try {
        // Charger séquentiellement pour éviter les requêtes simultanées
        await fetchModules();
        await fetchDependencies();
        await fetchFeatures();
        initialLoadCompletedRef.current = true;
      } catch (error) {
        console.error("Erreur lors du chargement initial des données:", error);
      } finally {
        isLoadingRef.current = false;
      }
    };
    
    loadData();
    
    // Setup refresh interval avec une fréquence plus basse
    const refreshInterval = setInterval(async () => {
      // Vérifier si un chargement est déjà en cours
      if (isLoadingRef.current) return;
      isLoadingRef.current = true;
      
      try {
        await fetchModules();
      } catch (error) {
        console.error("Erreur lors du rechargement périodique:", error);
      } finally {
        isLoadingRef.current = false;
      }
    }, 300000); // Toutes les 5 minutes au lieu de chaque minute
    
    // Cleanup function
    return () => {
      clearInterval(refreshInterval);
    };
  }, [fetchModules, fetchDependencies, fetchFeatures]);
};
