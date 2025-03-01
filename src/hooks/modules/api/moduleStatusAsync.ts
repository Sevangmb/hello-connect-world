
import { ModuleStatus } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { isAdminModule } from './moduleStatusCore';
import { getModuleCache } from './moduleStatusCore';

/**
 * Vérifie si un module est actif (version asynchrone)
 */
export const checkModuleActiveAsync = async (moduleCode: string): Promise<boolean> => {
  // Si c'est le module Admin ou commence par 'admin', toujours retourner true
  if (isAdminModule(moduleCode)) return true;

  // Essayer d'abord le cache en mémoire
  const { inMemoryModulesCache } = getModuleCache();
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
  if (isAdminModule(moduleCode)) return false;

  // Essayer d'abord le cache en mémoire
  const { inMemoryModulesCache } = getModuleCache();
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
  if (isAdminModule(moduleCode)) return true;

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
