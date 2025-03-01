
/**
 * API flexible pour accéder aux modules
 * Ce hook fournit une API unifiée pour accéder aux modules depuis n'importe quel composant
 */

import { useModuleApiCore } from './hooks/useModuleApiCore';

/**
 * API flexible pour accéder aux données des modules et fonctionnalités
 */
export const useModuleApi = () => {
  // Utiliser le hook core qui contient toute la logique
  return useModuleApiCore();
};
