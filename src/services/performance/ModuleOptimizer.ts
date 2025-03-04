
/**
 * Service d'optimisation des modules
 * Gère le chargement prioritaire des modules et l'optimisation des performances
 */
import { AppModule } from '@/hooks/modules/types';

// Priorités des modules (plus petit = plus prioritaire)
const MODULE_PRIORITIES: Record<string, number> = {
  'core': 0,   // Core est toujours prioritaire
  'admin': 1,  // Admin est le second plus prioritaire
  'menu': 2,   // Menu est le troisième plus prioritaire
  'user': 3,   // User est quatrième
  'auth': 4,   // Auth est cinquième
  // Les autres modules auront une priorité par défaut plus basse
};

// Délai maximum pour considérer le cache comme valide (30 min)
const CACHE_MAX_AGE = 30 * 60 * 1000;

class ModuleOptimizer {
  /**
   * Trie les modules par priorité pour chargement optimal
   */
  sortModulesByPriority(modules: AppModule[]): AppModule[] {
    return [...modules].sort((a, b) => {
      const priorityA = MODULE_PRIORITIES[a.code] || 99;
      const priorityB = MODULE_PRIORITIES[b.code] || 99;
      return priorityA - priorityB;
    });
  }

  /**
   * Retourne uniquement les modules essentiels pour le premier chargement
   */
  getEssentialModules(modules: AppModule[]): AppModule[] {
    return modules.filter(module => 
      module.is_core || 
      MODULE_PRIORITIES[module.code] < 3 ||
      module.status === 'active'
    );
  }

  /**
   * Précharge les modules prioritaires
   */
  preloadPriorityModules(): void {
    // Récupérer les modules depuis le cache
    try {
      const cachedModules = localStorage.getItem('modules_cache');
      if (cachedModules) {
        const modules = JSON.parse(cachedModules) as AppModule[];
        const essentialModules = this.getEssentialModules(modules);
        
        // Mettre en cache prioritaire (sessionStorage pour accès plus rapide)
        sessionStorage.setItem('priority_modules', JSON.stringify(essentialModules));
      }
    } catch (error) {
      console.error('Erreur lors du préchargement des modules prioritaires:', error);
    }
  }

  /**
   * Vérifie si le cache est valide
   */
  isCacheValid(): boolean {
    try {
      const timestamp = localStorage.getItem('modules_cache_timestamp');
      if (!timestamp) return false;
      
      const cacheTime = parseInt(timestamp, 10);
      const now = Date.now();
      
      return (now - cacheTime) < CACHE_MAX_AGE;
    } catch (error) {
      return false;
    }
  }

  /**
   * Optimise la stratégie de mise en cache
   */
  optimizeCache(modules: AppModule[]): void {
    try {
      // Stocker les modules complets dans localStorage
      localStorage.setItem('modules_cache', JSON.stringify(modules));
      localStorage.setItem('modules_cache_timestamp', Date.now().toString());
      
      // Stocker les modules essentiels dans sessionStorage pour accès plus rapide
      const essentialModules = this.getEssentialModules(modules);
      sessionStorage.setItem('priority_modules', JSON.stringify(essentialModules));
      
      // Stocker les statuts de modules dans un format plus léger pour vérifications rapides
      const moduleStatuses: Record<string, string> = {};
      modules.forEach(module => {
        moduleStatuses[module.code] = module.status;
      });
      sessionStorage.setItem('module_statuses', JSON.stringify(moduleStatuses));
    } catch (error) {
      console.error('Erreur lors de l\'optimisation du cache:', error);
    }
  }

  /**
   * Récupère rapidement les modules essentiels
   */
  getQuickStartModules(): AppModule[] | null {
    try {
      const priorityModules = sessionStorage.getItem('priority_modules');
      if (priorityModules) {
        return JSON.parse(priorityModules);
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}

// Exporter une instance unique
export const moduleOptimizer = new ModuleOptimizer();
