
import { AppModule } from '../types';
import { getFullModulesFromCache } from '../utils';

// Durée de validité du cache en millisecondes (5 minutes)
const CACHE_VALIDITY = 5 * 60 * 1000;

/**
 * Charge les modules depuis le cache localStorage
 */
export const loadModulesFromCache = (): AppModule[] | null => {
  const cachedModules = getFullModulesFromCache();
  if (cachedModules) {
    console.log('Modules chargés depuis le cache localStorage');
    return cachedModules;
  }
  return null;
};

/**
 * Charge les fonctionnalités depuis le cache localStorage
 */
export const loadFeaturesFromCache = (): Record<string, Record<string, boolean>> | null => {
  try {
    const cachedFeatures = localStorage.getItem('app_features_cache');
    const featuresTimestamp = localStorage.getItem('app_features_cache_timestamp');
    
    if (cachedFeatures && featuresTimestamp) {
      const now = Date.now();
      const cacheTime = parseInt(featuresTimestamp, 10);
      
      if (now - cacheTime <= CACHE_VALIDITY) {
        const features = JSON.parse(cachedFeatures);
        console.log('Fonctionnalités chargées depuis le cache localStorage');
        return features;
      }
    }
  } catch (e) {
    console.error('Erreur lors du chargement des fonctionnalités depuis le cache:', e);
  }
  return null;
};

/**
 * Sauvegarde les fonctionnalités dans le cache
 */
export const cacheFeaturesData = (features: Record<string, Record<string, boolean>>) => {
  try {
    localStorage.setItem('app_features_cache', JSON.stringify(features));
    localStorage.setItem('app_features_cache_timestamp', Date.now().toString());
  } catch (e) {
    console.error('Erreur lors de la mise en cache des fonctionnalités:', e);
  }
};
