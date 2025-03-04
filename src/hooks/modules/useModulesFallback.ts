
/**
 * Version légère du hook useModules pour les composants qui n'ont besoin que
 * de fonctionnalités basiques, évitant ainsi la charge complète
 */

import { useState, useEffect, useCallback } from 'react';
import { AppModule } from './types';

export const useModulesFallback = () => {
  const [loading, setLoading] = useState(false);
  const [modules, setModules] = useState<AppModule[]>([]);

  // Vérifier si un module est actif depuis le cache
  const isModuleActive = useCallback((moduleCode: string): boolean => {
    // Admin toujours actif
    if (moduleCode === 'admin' || moduleCode.startsWith('admin_')) {
      return true;
    }

    try {
      // Vérifier d'abord dans sessionStorage (plus rapide)
      const statusCache = sessionStorage.getItem('module_statuses');
      if (statusCache) {
        const statuses = JSON.parse(statusCache) as Record<string, string>;
        return statuses[moduleCode] === 'active';
      }

      // Sinon vérifier dans localStorage
      const modulesCache = localStorage.getItem('modules_cache');
      if (modulesCache) {
        const modules = JSON.parse(modulesCache) as AppModule[];
        const module = modules.find(m => m.code === moduleCode);
        return module?.status === 'active';
      }
    } catch (e) {
      // Retourner false en cas d'erreur
    }

    // Par défaut, actif pour les modules critiques
    return ['core', 'menu', 'auth'].includes(moduleCode);
  }, []);

  // Charger les modules depuis le cache au démarrage
  useEffect(() => {
    try {
      const cachedModules = localStorage.getItem('modules_cache');
      if (cachedModules) {
        setModules(JSON.parse(cachedModules));
      }
    } catch (e) {
      console.error('Erreur lors du chargement du cache des modules:', e);
    }
  }, []);

  return {
    loading,
    modules,
    isModuleActive,
    // Version simplifiée qui ne fait rien
    fetchModules: () => Promise.resolve(modules),
    error: null
  };
};
