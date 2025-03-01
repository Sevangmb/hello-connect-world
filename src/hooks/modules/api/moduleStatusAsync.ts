
import { ModuleStatus } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { isAdminModule, getModuleCache, getModuleStatusFromCache } from './moduleStatusCore';

// Cache des résultats des vérifications pour éviter des appels répétés
const featuresEnabledCache: Record<string, {enabled: boolean, timestamp: number}> = {};
// Durée de validité du cache de features: 30 secondes
const FEATURES_CACHE_VALIDITY_MS = 30000;

/**
 * Vérifie si un module est actif (version asynchrone)
 * Utilise d'abord le cache, puis interroge Supabase si nécessaire
 */
export const checkModuleActiveAsync = async (moduleCode: string): Promise<boolean> => {
  // Si c'est le module Admin ou commence par 'admin', toujours retourner true
  if (isAdminModule(moduleCode)) return true;

  // Essayer d'abord le cache rapide
  const cachedStatus = getModuleStatusFromCache(moduleCode);
  if (cachedStatus !== null) {
    return cachedStatus === 'active';
  }

  // Essayer ensuite le cache en mémoire
  const { inMemoryModulesCache } = getModuleCache();
  if (inMemoryModulesCache) {
    const module = inMemoryModulesCache.find(m => m.code === moduleCode);
    if (module) {
      return module.status === 'active';
    }
  }

  // Si pas de cache ou module non trouvé, charger depuis Supabase
  try {
    console.log(`Module ${moduleCode} non trouvé en cache, chargement depuis Supabase...`);
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
 * Utilise d'abord le cache, puis interroge Supabase si nécessaire
 */
export const checkModuleDegradedAsync = async (moduleCode: string): Promise<boolean> => {
  // Si c'est le module Admin ou commence par 'admin', jamais en mode dégradé
  if (isAdminModule(moduleCode)) return false;

  // Essayer d'abord le cache rapide
  const cachedStatus = getModuleStatusFromCache(moduleCode);
  if (cachedStatus !== null) {
    return cachedStatus === 'degraded';
  }

  // Essayer ensuite le cache en mémoire
  const { inMemoryModulesCache } = getModuleCache();
  if (inMemoryModulesCache) {
    const module = inMemoryModulesCache.find(m => m.code === moduleCode);
    if (module) {
      return module.status === 'degraded';
    }
  }

  // Si pas de cache ou module non trouvé, charger depuis Supabase
  try {
    console.log(`Module ${moduleCode} non trouvé en cache, chargement depuis Supabase...`);
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
 * Utilise d'abord le cache, puis interroge Supabase si nécessaire
 */
export const checkFeatureEnabledAsync = async (
  moduleCode: string, 
  featureCode: string, 
  isModuleActive: (code: string) => Promise<boolean>
): Promise<boolean> => {
  // Si c'est le module Admin ou commence par 'admin', toujours activer ses fonctionnalités
  if (isAdminModule(moduleCode)) return true;

  // Créer une clé unique pour le cache
  const cacheKey = `${moduleCode}:${featureCode}`;
  
  // Vérifier dans le cache des fonctionnalités
  const cachedFeature = featuresEnabledCache[cacheKey];
  if (cachedFeature && (Date.now() - cachedFeature.timestamp < FEATURES_CACHE_VALIDITY_MS)) {
    return cachedFeature.enabled;
  }

  // Vérifier d'abord si le module est actif
  const moduleActive = await isModuleActive(moduleCode);
  if (!moduleActive) {
    // Mettre à jour le cache avec "false"
    featuresEnabledCache[cacheKey] = { enabled: false, timestamp: Date.now() };
    return false;
  }

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

    const isEnabled = data?.is_enabled || false;
    
    // Mettre à jour le cache
    featuresEnabledCache[cacheKey] = { enabled: isEnabled, timestamp: Date.now() };
    
    return isEnabled;
  } catch (e) {
    console.error('Exception lors de la vérification du statut de la fonctionnalité:', e);
    return false;
  }
};
