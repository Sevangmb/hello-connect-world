
import { supabase } from '@/integrations/supabase/client';

// Fonction d'optimisation pour pré-charger les statuts depuis Supabase
export const preloadModuleStatuses = async (): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('app_modules')
      .select('code, status')
      .order('name');

    if (!error && data) {
      const statuses: Record<string, string> = {};
      data.forEach(module => {
        statuses[module.code] = module.status;
      });
      
      // Mettre à jour le cache localStorage
      try {
        localStorage.setItem('app_modules_status_cache', JSON.stringify(statuses));
        localStorage.setItem('app_modules_status_timestamp', Date.now().toString());
      } catch (e) {
        console.error('Erreur lors de la mise en cache des statuts de modules:', e);
      }
      
      // Mettre à jour le cache en mémoire
      updateModuleCache(data);
    }
  } catch (e) {
    console.error('Erreur lors du préchargement des statuts de modules:', e);
  }
};

// Fonction utilitaire pour mise à jour du cache
export const updateModuleCache = (modules: any[]) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('module_cache_updated', { 
      detail: { modules }
    }));
  }
};
