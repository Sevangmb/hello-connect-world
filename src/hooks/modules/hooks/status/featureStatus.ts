
import { ADMIN_MODULE_CODE } from '../../constants';

// Cache en mémoire par session pour les résultats des vérifications
const statusVerificationCache: Record<string, {result: boolean, timestamp: number}> = {};
const VERIFICATION_CACHE_VALIDITY_MS = 5000; // 5 secondes

/**
 * Vérifie si une fonctionnalité est activée (version synchrone)
 */
export const getFeatureEnabledStatus = (
  moduleCode: string,
  featureCode: string,
  features: Record<string, Record<string, boolean>>,
  getModuleActiveStatus: (moduleCode: string) => boolean
): boolean => {
  // Si c'est le module Admin, toutes les fonctionnalités sont actives
  if (moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin')) return true;

  // Vérifier le cache de vérification en premier
  const cacheKey = `feature:${moduleCode}:${featureCode}`;
  const now = Date.now();
  const cached = statusVerificationCache[cacheKey];
  if (cached && (now - cached.timestamp < VERIFICATION_CACHE_VALIDITY_MS)) {
    return cached.result;
  }

  // Vérifier d'abord si le module est actif
  const moduleActive = getModuleActiveStatus(moduleCode);
  if (!moduleActive) {
    statusVerificationCache[cacheKey] = { result: false, timestamp: now };
    return false;
  }

  // Vérifier dans les fonctionnalités locales
  if (features[moduleCode]) {
    const featureEnabled = features[moduleCode][featureCode];
    if (featureEnabled !== undefined) {
      statusVerificationCache[cacheKey] = { result: featureEnabled, timestamp: now };
      return featureEnabled;
    }
  }

  // Par défaut activé
  statusVerificationCache[cacheKey] = { result: true, timestamp: now };
  return true;
};
