
/**
 * Hook pour gérer la priorité des modules
 * Permet de charger en priorité certains modules en fonction de l'historique d'utilisation
 */
import { useEffect, useState } from 'react';
import { AppModule } from '../types';
import { supabase } from '@/integrations/supabase/client';

export const useModulePriority = () => {
  const [priorityModules, setPriorityModules] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Charger les priorités des modules
  useEffect(() => {
    if (isInitialized) return;

    const loadPriorities = async () => {
      try {
        // Essayer d'abord de charger depuis le localStorage
        const cachedPriorities = localStorage.getItem('module_priorities');
        if (cachedPriorities) {
          try {
            const parsed = JSON.parse(cachedPriorities);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setPriorityModules(parsed);
              setIsInitialized(true);
              return;
            }
          } catch (e) {
            console.error("Erreur lors de la lecture des priorités en cache:", e);
          }
        }

        // Sinon charger depuis la base de données
        const { data, error } = await supabase
          .from('module_usage_stats')
          .select('module_code, usage_count')
          .order('usage_count', { ascending: false })
          .limit(10);

        if (error) throw error;

        if (data && data.length > 0) {
          const modules = data.map(item => item.module_code);
          setPriorityModules(modules);
          
          // Mettre en cache
          localStorage.setItem('module_priorities', JSON.stringify(modules));
        } else {
          // Définir des priorités par défaut
          const defaultPriorities = ['auth', 'core', 'admin', 'shop'];
          setPriorityModules(defaultPriorities);
          localStorage.setItem('module_priorities', JSON.stringify(defaultPriorities));
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error("Erreur lors du chargement des priorités de modules:", error);
        // Utiliser des valeurs par défaut en cas d'erreur
        setPriorityModules(['auth', 'core', 'admin', 'shop']);
        setIsInitialized(true);
      }
    };

    loadPriorities();
  }, [isInitialized]);

  // Enregistrer l'utilisation d'un module
  const recordModuleUsage = async (moduleCode: string) => {
    try {
      // Enregistrement local pour ne pas surcharger la base de données
      const now = Date.now();
      const lastRecordTime = localStorage.getItem(`module_usage_last_${moduleCode}`);
      
      // Limiter les enregistrements à un par heure par module
      if (lastRecordTime && now - parseInt(lastRecordTime) < 3600000) {
        return;
      }
      
      localStorage.setItem(`module_usage_last_${moduleCode}`, now.toString());
      
      // Enregistrer en base de données
      await supabase.rpc('increment_module_usage', {
        module_code: moduleCode
      });
      
      console.log(`Usage du module ${moduleCode} enregistré`);
    } catch (error) {
      console.error(`Erreur lors de l'enregistrement de l'usage du module ${moduleCode}:`, error);
    }
  };

  // Précharger un module
  const preloadModule = async (moduleCode: string) => {
    try {
      // Vérifier si déjà préchargé récemment
      const preloadedModules = localStorage.getItem('preloaded_modules');
      const preloaded = preloadedModules ? JSON.parse(preloadedModules) : {};
      
      if (preloaded[moduleCode] && Date.now() - preloaded[moduleCode] < 600000) {
        // Si préchargé il y a moins de 10 minutes, ne pas refaire
        return;
      }
      
      // Précharger le module
      const { data } = await supabase
        .from('app_modules')
        .select('*')
        .eq('code', moduleCode)
        .single();
      
      if (data) {
        // Marquer comme préchargé
        preloaded[moduleCode] = Date.now();
        localStorage.setItem('preloaded_modules', JSON.stringify(preloaded));
        
        // Précharger aussi les features
        await supabase
          .from('module_features')
          .select('*')
          .eq('module_code', moduleCode);
      }
    } catch (error) {
      console.error(`Erreur lors du préchargement du module ${moduleCode}:`, error);
    }
  };

  // Précharger tous les modules prioritaires
  const preloadPriorityModules = async () => {
    for (const moduleCode of priorityModules) {
      await preloadModule(moduleCode);
    }
  };

  return {
    priorityModules,
    isInitialized,
    recordModuleUsage,
    preloadModule,
    preloadPriorityModules
  };
};
