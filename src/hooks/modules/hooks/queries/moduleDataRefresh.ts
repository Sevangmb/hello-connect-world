
import { AppModule, ModuleStatus } from '../../types';
import { getModuleCache, updateModuleCache } from '../../api/moduleStatusCore';
import { fetchAllModules, fetchAllFeatures } from '../../api/moduleSync';

/**
 * Rafraîchit tous les modules depuis Supabase
 */
export const refreshModulesData = async (
  setInternalModules: React.Dispatch<React.SetStateAction<AppModule[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  internalModules: AppModule[]
): Promise<AppModule[]> => {
  const { inMemoryModulesCache, lastFetchTimestamp } = getModuleCache();
  const now = Date.now();
  const force = true; // Forcer la mise à jour pour s'assurer d'avoir les dernières données

  // Utiliser le cache si récent et pas de forçage
  if (inMemoryModulesCache && inMemoryModulesCache.length > 0 && !force && (now - lastFetchTimestamp < 30000)) {
    console.log(`Using in-memory cache with ${inMemoryModulesCache.length} modules (cache age: ${now - lastFetchTimestamp}ms)`);
    setInternalModules(inMemoryModulesCache);
    return inMemoryModulesCache;
  }

  setLoading(true);
  try {
    console.log("Fetching modules from Supabase...");
    const modulesData = await fetchAllModules(force);
    console.log(`Fetched ${modulesData.length} modules from Supabase`);
    
    // Vérifier que les modules contiennent bien des valeurs ModuleStatus valides
    const validatedModules = modulesData.map(module => {
      if (module.status !== 'active' && module.status !== 'inactive' && module.status !== 'degraded') {
        console.warn(`Invalid module status "${module.status}" for module ${module.code}, defaulting to "inactive"`);
        return { ...module, status: 'inactive' as ModuleStatus };
      }
      return module;
    });
    
    // Mettre à jour les états
    setInternalModules(validatedModules);
    updateModuleCache(validatedModules);
    setLoading(false);
    
    return validatedModules;
  } catch (e: any) {
    console.error('Erreur lors du chargement des modules:', e);
    setError(e.message || 'Erreur lors du chargement des modules');
    setLoading(false);
    
    // Retourner le cache en cas d'erreur
    return inMemoryModulesCache || internalModules || [];
  }
};

/**
 * Rafraîchit toutes les fonctionnalités depuis Supabase
 */
export const refreshFeaturesData = async (
  setFeatures: React.Dispatch<React.SetStateAction<Record<string, Record<string, boolean>>>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  features: Record<string, Record<string, boolean>>
): Promise<Record<string, Record<string, boolean>>> => {
  setLoading(true);
  try {
    const featuresData = await fetchAllFeatures();
    setFeatures(featuresData);
    setLoading(false);
    return featuresData;
  } catch (e: any) {
    setError(e.message || 'Erreur lors du chargement des fonctionnalités');
    setLoading(false);
    return features;
  }
};
