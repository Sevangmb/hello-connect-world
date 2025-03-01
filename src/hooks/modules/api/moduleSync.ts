
import { supabase } from '@/integrations/supabase/client';
import { AppModule, ModuleStatus } from '../types';
import { cacheFullModules } from '../utils';
import { ADMIN_MODULE_CODE } from '../useModules';

/**
 * Récupère tous les modules depuis Supabase
 */
export const fetchAllModules = async (force = false): Promise<AppModule[]> => {
  try {
    console.log("Fetching modules from Supabase...");
    
    // Vérifier d'abord le cache local si on ne force pas le rafraîchissement
    if (!force) {
      try {
        const cachedModules = localStorage.getItem('app_modules_cache');
        const cachedTimestamp = localStorage.getItem('app_modules_cache_timestamp');
        
        if (cachedModules && cachedTimestamp) {
          const now = Date.now();
          const cacheTime = parseInt(cachedTimestamp, 10);
          
          // Cache valide pour 2 minutes (réduit de 5 minutes)
          if (now - cacheTime <= 2 * 60 * 1000) {
            const parsedModules = JSON.parse(cachedModules);
            console.log(`Utilisation de ${parsedModules.length} modules du cache local`);
            return parsedModules;
          }
        }
      } catch (cacheError) {
        console.error('Erreur lors de la lecture du cache:', cacheError);
      }
    }
    
    // Si pas de cache ou force=true, charger depuis Supabase
    const { data, error } = await supabase
      .from('app_modules')
      .select('*')
      .order('name');

    if (error) {
      console.error('Erreur lors du chargement des modules:', error);
      throw error;
    }

    console.log(`Data de Supabase pour modules:`, data);

    // S'assurer que le module Admin est toujours actif
    const modulesData = data.map(module => {
      // Vérifier que le status est bien une valeur valide de ModuleStatus
      let validStatus: ModuleStatus = 'inactive';
      if (module.status === 'active' || module.status === 'degraded' || module.status === 'inactive') {
        validStatus = module.status as ModuleStatus;
      }
      
      if (module.code === ADMIN_MODULE_CODE && validStatus !== 'active') {
        // Réparer automatiquement
        supabase
          .from('app_modules')
          .update({ status: 'active', updated_at: new Date().toISOString() })
          .eq('id', module.id)
          .then(() => {
            console.log('Module Admin réactivé automatiquement');
          });
        return { ...module, status: 'active' as ModuleStatus };
      }
      return { ...module, status: validStatus };
    }) as AppModule[];

    console.log(`Loaded ${modulesData.length} modules from Supabase`);
    
    // Mettre à jour le cache
    cacheFullModules(modulesData);

    return modulesData;
  } catch (e: any) {
    console.error('Exception lors du chargement des modules:', e);
    throw e;
  }
};

/**
 * Récupère toutes les fonctionnalités depuis Supabase
 */
export const fetchAllFeatures = async (): Promise<Record<string, Record<string, boolean>>> => {
  try {
    // Vérifier d'abord le cache local
    try {
      const cachedFeatures = localStorage.getItem('app_features_cache');
      const cachedTimestamp = localStorage.getItem('app_features_cache_timestamp');
      
      if (cachedFeatures && cachedTimestamp) {
        const now = Date.now();
        const cacheTime = parseInt(cachedTimestamp, 10);
        
        // Cache valide pour 2 minutes
        if (now - cacheTime <= 2 * 60 * 1000) {
          const parsedFeatures = JSON.parse(cachedFeatures);
          console.log('Utilisation des fonctionnalités du cache local');
          return parsedFeatures;
        }
      }
    } catch (cacheError) {
      console.error('Erreur lors de la lecture du cache des fonctionnalités:', cacheError);
    }
    
    const { data, error } = await supabase
      .from('module_features')
      .select('*');

    if (error) {
      console.error('Erreur lors du chargement des fonctionnalités:', error);
      throw error;
    }

    console.log(`Data des fonctionnalités de Supabase:`, data);

    // Organiser les fonctionnalités par module
    const featuresData: Record<string, Record<string, boolean>> = {};
    
    data.forEach(feature => {
      // S'assurer que les fonctionnalités Admin sont toujours activées
      if ((feature.module_code === ADMIN_MODULE_CODE || feature.module_code.startsWith('admin')) && !feature.is_enabled) {
        // Réparer automatiquement
        supabase
          .from('module_features')
          .update({ is_enabled: true, updated_at: new Date().toISOString() })
          .eq('id', feature.id)
          .then(() => {
            console.log('Fonctionnalité Admin réactivée automatiquement');
          });
        feature.is_enabled = true;
      }
      
      if (!featuresData[feature.module_code]) {
        featuresData[feature.module_code] = {};
      }
      featuresData[feature.module_code][feature.feature_code] = feature.is_enabled;
    });

    // Mettre à jour le cache local storage
    try {
      localStorage.setItem('app_features_cache', JSON.stringify(featuresData));
      localStorage.setItem('app_features_cache_timestamp', Date.now().toString());
    } catch (e) {
      console.error('Erreur lors de la mise en cache des fonctionnalités:', e);
    }

    return featuresData;
  } catch (e: any) {
    console.error('Exception lors du chargement des fonctionnalités:', e);
    throw e;
  }
};

/**
 * Configure un canal Supabase Realtime pour surveiller les changements de modules
 */
export const setupModuleRealtimeChannel = (onModuleChange: () => void, onFeatureChange: () => void) => {
  // Supprimer les canaux existants pour éviter les duplications
  const existingChannels = supabase.getChannels();
  existingChannels.forEach(ch => {
    if (ch.topic.includes('module-api-changes')) {
      supabase.removeChannel(ch);
    }
  });

  const channel = supabase.channel('module-api-changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'app_modules'
    }, (payload) => {
      console.log('Changement détecté dans les modules, payload:', payload);
      onModuleChange();
    })
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'module_features'
    }, (payload) => {
      console.log('Changement détecté dans les fonctionnalités, payload:', payload);
      onFeatureChange();
    })
    .subscribe((status, err) => {
      console.log('Statut d\'abonnement Realtime:', status);
      if (err) {
        console.error('Erreur d\'abonnement Realtime:', err);
      }
    });

  return channel;
};
