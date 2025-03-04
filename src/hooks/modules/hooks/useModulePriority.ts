
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook pour gérer la priorité de chargement des modules
 */
export const useModulePriority = () => {
  const [priorityModules, setPriorityModules] = useState<string[]>(['auth', 'core', 'admin']);
  const [isLoading, setIsLoading] = useState(false);
  
  // Charger les priorités depuis Supabase
  useEffect(() => {
    const loadPriorities = async () => {
      try {
        // Récupérer les modules les plus utilisés
        const { data, error } = await supabase
          .from('module_usage_stats')
          .select('module_code, usage_count')
          .order('usage_count', { ascending: false })
          .limit(10);
        
        if (error) {
          console.error('Erreur lors du chargement des priorités:', error);
          return;
        }
        
        if (data && data.length > 0) {
          // Extraire les codes de module
          const moduleCodes = data.map(item => item.module_code);
          
          // Fusionner avec les priorités par défaut (en gardant les valeurs uniques)
          const combinedPriorities = [...new Set([...moduleCodes, ...priorityModules])];
          setPriorityModules(combinedPriorities);
          
          console.log('Priorités de modules chargées:', combinedPriorities);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des priorités:', err);
      }
    };
    
    // Charger les priorités au démarrage
    loadPriorities();
  }, [priorityModules]);
  
  // Précharger les modules prioritaires
  const preloadPriorityModules = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Précharger les modules prioritaires en parallèle
      await Promise.all(
        priorityModules.map(async (moduleCode) => {
          try {
            console.log(`Préchargement du module ${moduleCode}...`);
            
            // Charger les données du module
            const { data } = await supabase
              .from('app_modules')
              .select('*')
              .eq('code', moduleCode)
              .single();
            
            if (data) {
              console.log(`Module ${moduleCode} préchargé avec succès`);
              
              // Incrémenter les statistiques d'utilisation
              await incrementModuleUsage(moduleCode);
            }
          } catch (err) {
            console.error(`Erreur lors du préchargement du module ${moduleCode}:`, err);
          }
        })
      );
    } catch (err) {
      console.error('Erreur lors du préchargement des modules:', err);
    } finally {
      setIsLoading(false);
    }
  }, [priorityModules]);
  
  // Incrémenter les statistiques d'utilisation d'un module
  const incrementModuleUsage = async (moduleCode: string) => {
    try {
      // Utiliser la fonction RPC pour incrémenter l'utilisation
      const { error } = await supabase
        .rpc('increment_module_usage', { module_code: moduleCode });
      
      if (error) {
        console.error(`Erreur lors de l'incrémentation de l'utilisation du module ${moduleCode}:`, error);
      }
    } catch (err) {
      console.error(`Erreur lors de l'incrémentation de l'utilisation du module ${moduleCode}:`, err);
    }
  };
  
  return {
    priorityModules,
    isLoading,
    preloadPriorityModules,
    incrementModuleUsage
  };
};
