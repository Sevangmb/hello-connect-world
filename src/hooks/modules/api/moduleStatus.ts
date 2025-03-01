
import { ModuleStatus, AppModule } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { ADMIN_MODULE_CODE } from '../useModules';

// Cache for modules and features
let inMemoryModulesCache: AppModule[] | null = null;
let lastFetchTimestamp = 0;

/**
 * Vérifie si un module est actif (version asynchrone)
 */
export const checkModuleActiveAsync = async (moduleCode: string): Promise<boolean> => {
  // Si c'est le module Admin ou commence par 'admin', toujours retourner true
  if (moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin')) return true;

  // Essayer d'abord le cache en mémoire
  if (inMemoryModulesCache) {
    const module = inMemoryModulesCache.find(m => m.code === moduleCode);
    if (module) {
      return module.status === 'active';
    }
  }

  // Si pas de cache ou module non trouvé, charger depuis Supabase
  try {
    const { data, error } = await supabase
      .from('app_modules')
      .select('status')
      .eq('code', moduleCode)
      .single();

    if (error) {
      console.error('Erreur lors de la vérification du statut du module:', error);
      return false;
    }

    return data?.status === 'active';
  } catch (e) {
    console.error('Exception lors de la vérification du statut du module:', e);
    return false;
  }
};

/**
 * Vérifie si un module est en mode dégradé (version asynchrone)
 */
export const checkModuleDegradedAsync = async (moduleCode: string): Promise<boolean> => {
  // Si c'est le module Admin ou commence par 'admin', jamais en mode dégradé
  if (moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin')) return false;

  // Essayer d'abord le cache en mémoire
  if (inMemoryModulesCache) {
    const module = inMemoryModulesCache.find(m => m.code === moduleCode);
    if (module) {
      return module.status === 'degraded';
    }
  }

  // Si pas de cache ou module non trouvé, charger depuis Supabase
  try {
    const { data, error } = await supabase
      .from('app_modules')
      .select('status')
      .eq('code', moduleCode)
      .single();

    if (error) {
      console.error('Erreur lors de la vérification du statut du module:', error);
      return false;
    }

    return data?.status === 'degraded';
  } catch (e) {
    console.error('Exception lors de la vérification du statut du module:', e);
    return false;
  }
};

/**
 * Vérifie si une fonctionnalité spécifique est activée (version asynchrone)
 */
export const checkFeatureEnabledAsync = async (
  moduleCode: string, 
  featureCode: string, 
  isModuleActive: (code: string) => Promise<boolean>
): Promise<boolean> => {
  // Si c'est le module Admin ou commence par 'admin', toujours activer ses fonctionnalités
  if (moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin')) return true;

  // Vérifier d'abord si le module est actif
  const moduleActive = await isModuleActive(moduleCode);
  if (!moduleActive) return false;

  // Si pas en mémoire, charger depuis Supabase
  try {
    const { data, error } = await supabase
      .from('module_features')
      .select('is_enabled')
      .eq('module_code', moduleCode)
      .eq('feature_code', featureCode)
      .single();

    if (error) {
      console.error('Erreur lors de la vérification du statut de la fonctionnalité:', error);
      return false;
    }

    return data?.is_enabled || false;
  } catch (e) {
    console.error('Exception lors de la vérification du statut de la fonctionnalité:', e);
    return false;
  }
};

/**
 * Met à jour le statut d'un module dans Supabase
 */
export const updateModuleStatusInDb = async (
  moduleId: string, 
  status: ModuleStatus, 
  isAdminModule: boolean
): Promise<boolean> => {
  // Bloquer la désactivation du module Admin
  if (isAdminModule && status !== 'active') {
    console.error("Le module Admin ne peut pas être désactivé");
    return false;
  }

  try {
    const { error } = await supabase
      .from('app_modules')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', moduleId);

    if (error) {
      console.error('Erreur lors de la mise à jour du statut du module:', error);
      return false;
    }

    return true;
  } catch (e) {
    console.error('Exception lors de la mise à jour du statut du module:', e);
    return false;
  }
};

/**
 * Met à jour le statut d'une fonctionnalité dans Supabase
 */
export const updateFeatureStatusInDb = async (
  moduleCode: string, 
  featureCode: string, 
  isEnabled: boolean,
  isAdminModule: boolean
): Promise<boolean> => {
  // Bloquer la désactivation des fonctionnalités du module Admin
  if (isAdminModule && !isEnabled) {
    console.error("Les fonctionnalités du module Admin ne peuvent pas être désactivées");
    return false;
  }

  try {
    const { error } = await supabase
      .from('module_features')
      .update({ 
        is_enabled: isEnabled, 
        updated_at: new Date().toISOString() 
      })
      .eq('module_code', moduleCode)
      .eq('feature_code', featureCode);

    if (error) {
      console.error('Erreur lors de la mise à jour du statut de la fonctionnalité:', error);
      return false;
    }

    return true;
  } catch (e) {
    console.error('Exception lors de la mise à jour du statut de la fonctionnalité:', e);
    return false;
  }
};

/**
 * Mettre à jour le cache en mémoire
 */
export const updateModuleCache = (modules: AppModule[]) => {
  inMemoryModulesCache = modules;
  lastFetchTimestamp = Date.now();
};

/**
 * Obtenir le cache
 */
export const getModuleCache = () => {
  return { inMemoryModulesCache, lastFetchTimestamp };
};
