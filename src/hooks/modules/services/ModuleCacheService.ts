
/**
 * Service responsable de la gestion du cache des modules
 * Implémente un mécanisme avancé avec durées d'expiration configurables
 */
import { AppModule, ModuleStatus } from '../types';
import { ADMIN_MODULE_CODE } from '../constants';

// Configuration du cache
interface CacheConfig {
  modulesExpiryTime: number;     // Durée de validité du cache des modules complets (ms)
  statusExpiryTime: number;      // Durée de validité du cache des statuts (ms)
  featuresExpiryTime: number;    // Durée de validité du cache des fonctionnalités (ms)
  backgroundRefreshEnabled: boolean; // Activer le rafraîchissement en arrière-plan
  backgroundRefreshInterval: number; // Intervalle de rafraîchissement en arrière-plan (ms)
}

// Cache par défaut
const DEFAULT_CACHE_CONFIG: CacheConfig = {
  modulesExpiryTime: 5 * 60 * 1000,   // 5 minutes
  statusExpiryTime: 60 * 1000,        // 1 minute
  featuresExpiryTime: 5 * 60 * 1000,  // 5 minutes
  backgroundRefreshEnabled: true,
  backgroundRefreshInterval: 4 * 60 * 1000 // 4 minutes (juste avant l'expiration)
};

// Clés de cache
const CACHE_KEYS = {
  MODULES: 'app_modules_cache',
  MODULES_TIMESTAMP: 'app_modules_cache_timestamp',
  STATUSES: 'app_modules_status_cache',
  STATUSES_TIMESTAMP: 'app_modules_status_timestamp',
  FEATURES: 'app_features_cache',
  FEATURES_TIMESTAMP: 'app_features_cache_timestamp'
};

// Structure du cache en mémoire
interface MemoryCache<T> {
  data: T;
  timestamp: number;
}

class ModuleCacheService {
  private config: CacheConfig;
  private memoryModulesCache: MemoryCache<AppModule[]> | null = null;
  private memoryStatusesCache: MemoryCache<Record<string, ModuleStatus>> | null = null;
  private memoryFeaturesCache: MemoryCache<Record<string, Record<string, boolean>>> | null = null;
  private backgroundRefreshTimer: number | null = null;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = { ...DEFAULT_CACHE_CONFIG, ...config };
    
    // Initialiser le rafraîchissement en arrière-plan si activé
    if (this.config.backgroundRefreshEnabled) {
      this.setupBackgroundRefresh();
    }
    
    // Écouter les événements de mise à jour du cache
    this.listenForCacheEvents();
  }

  // Stockage des modules dans le cache
  public cacheModules(modules: AppModule[]): void {
    try {
      // Mettre à jour le cache en mémoire
      this.memoryModulesCache = {
        data: modules,
        timestamp: Date.now()
      };
      
      // Mettre à jour le localStorage
      localStorage.setItem(CACHE_KEYS.MODULES, JSON.stringify(modules));
      localStorage.setItem(CACHE_KEYS.MODULES_TIMESTAMP, Date.now().toString());
      
      // Mettre également à jour le cache des statuts
      this.cacheModuleStatuses(modules);
      
      console.log(`ModuleCacheService: ${modules.length} modules mis en cache`);
      
      // Déclencher un événement pour les autres composants/onglets
      this.dispatchCacheEvent('modules_cache_updated');
    } catch (e) {
      console.error('ModuleCacheService: Erreur lors de la mise en cache des modules:', e);
    }
  }
  
  // Stockage des statuts dans le cache
  public cacheModuleStatuses(modules: AppModule[]): void {
    try {
      const statuses: Record<string, ModuleStatus> = {};
      
      for (const module of modules) {
        statuses[module.code] = module.status;
      }
      
      // Mettre à jour le cache en mémoire
      this.memoryStatusesCache = {
        data: statuses,
        timestamp: Date.now()
      };
      
      // Mettre à jour le localStorage
      localStorage.setItem(CACHE_KEYS.STATUSES, JSON.stringify(statuses));
      localStorage.setItem(CACHE_KEYS.STATUSES_TIMESTAMP, Date.now().toString());
      
      console.log(`ModuleCacheService: ${Object.keys(statuses).length} statuts de modules mis en cache`);
    } catch (e) {
      console.error('ModuleCacheService: Erreur lors de la mise en cache des statuts de modules:', e);
    }
  }
  
  // Stockage des fonctionnalités dans le cache
  public cacheFeatures(features: Record<string, Record<string, boolean>>): void {
    try {
      // Mettre à jour le cache en mémoire
      this.memoryFeaturesCache = {
        data: features,
        timestamp: Date.now()
      };
      
      // Mettre à jour le localStorage
      localStorage.setItem(CACHE_KEYS.FEATURES, JSON.stringify(features));
      localStorage.setItem(CACHE_KEYS.FEATURES_TIMESTAMP, Date.now().toString());
      
      console.log(`ModuleCacheService: Fonctionnalités mises en cache pour ${Object.keys(features).length} modules`);
      
      // Déclencher un événement pour les autres composants/onglets
      this.dispatchCacheEvent('features_cache_updated');
    } catch (e) {
      console.error('ModuleCacheService: Erreur lors de la mise en cache des fonctionnalités:', e);
    }
  }
  
  // Récupération des modules depuis le cache
  public getModulesFromCache(): AppModule[] | null {
    // Vérifier d'abord le cache en mémoire
    if (this.memoryModulesCache && 
        Date.now() - this.memoryModulesCache.timestamp < this.config.modulesExpiryTime) {
      return this.memoryModulesCache.data;
    }
    
    // Sinon, essayer le localStorage
    try {
      const cachedData = localStorage.getItem(CACHE_KEYS.MODULES);
      const cachedTimestamp = localStorage.getItem(CACHE_KEYS.MODULES_TIMESTAMP);
      
      if (cachedData && cachedTimestamp) {
        const timestamp = parseInt(cachedTimestamp, 10);
        
        if (Date.now() - timestamp < this.config.modulesExpiryTime) {
          const parsedData = JSON.parse(cachedData) as AppModule[];
          
          // Actualiser le cache en mémoire
          this.memoryModulesCache = {
            data: parsedData,
            timestamp
          };
          
          return parsedData;
        } else {
          console.log("ModuleCacheService: Cache des modules expiré");
        }
      }
    } catch (e) {
      console.error('ModuleCacheService: Erreur lors de la lecture du cache des modules:', e);
    }
    
    return null;
  }
  
  // Récupération d'un statut de module spécifique
  public getModuleStatus(moduleCode: string): ModuleStatus | null {
    // Si c'est le module Admin, toujours considérer actif
    if (moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin_')) {
      return 'active';
    }
    
    // Vérifier d'abord le cache en mémoire
    if (this.memoryStatusesCache && 
        Date.now() - this.memoryStatusesCache.timestamp < this.config.statusExpiryTime) {
      return this.memoryStatusesCache.data[moduleCode] || null;
    }
    
    // Sinon, essayer le localStorage
    try {
      const cachedData = localStorage.getItem(CACHE_KEYS.STATUSES);
      const cachedTimestamp = localStorage.getItem(CACHE_KEYS.STATUSES_TIMESTAMP);
      
      if (cachedData && cachedTimestamp) {
        const timestamp = parseInt(cachedTimestamp, 10);
        
        if (Date.now() - timestamp < this.config.statusExpiryTime) {
          const statuses = JSON.parse(cachedData) as Record<string, ModuleStatus>;
          
          // Actualiser le cache en mémoire
          this.memoryStatusesCache = {
            data: statuses,
            timestamp
          };
          
          return statuses[moduleCode] || null;
        }
      }
    } catch (e) {
      console.error('ModuleCacheService: Erreur lors de la lecture du cache des statuts:', e);
    }
    
    return null;
  }
  
  // Récupération des fonctionnalités depuis le cache
  public getFeaturesFromCache(): Record<string, Record<string, boolean>> | null {
    // Vérifier d'abord le cache en mémoire
    if (this.memoryFeaturesCache && 
        Date.now() - this.memoryFeaturesCache.timestamp < this.config.featuresExpiryTime) {
      return this.memoryFeaturesCache.data;
    }
    
    // Sinon, essayer le localStorage
    try {
      const cachedData = localStorage.getItem(CACHE_KEYS.FEATURES);
      const cachedTimestamp = localStorage.getItem(CACHE_KEYS.FEATURES_TIMESTAMP);
      
      if (cachedData && cachedTimestamp) {
        const timestamp = parseInt(cachedTimestamp, 10);
        
        if (Date.now() - timestamp < this.config.featuresExpiryTime) {
          const features = JSON.parse(cachedData);
          
          // Actualiser le cache en mémoire
          this.memoryFeaturesCache = {
            data: features,
            timestamp
          };
          
          return features;
        }
      }
    } catch (e) {
      console.error('ModuleCacheService: Erreur lors de la lecture du cache des fonctionnalités:', e);
    }
    
    return null;
  }
  
  // Purger le cache
  public clearCache(): void {
    // Vider les caches en mémoire
    this.memoryModulesCache = null;
    this.memoryStatusesCache = null;
    this.memoryFeaturesCache = null;
    
    // Vider le localStorage
    try {
      localStorage.removeItem(CACHE_KEYS.MODULES);
      localStorage.removeItem(CACHE_KEYS.MODULES_TIMESTAMP);
      localStorage.removeItem(CACHE_KEYS.STATUSES);
      localStorage.removeItem(CACHE_KEYS.STATUSES_TIMESTAMP);
      localStorage.removeItem(CACHE_KEYS.FEATURES);
      localStorage.removeItem(CACHE_KEYS.FEATURES_TIMESTAMP);
      
      console.log('ModuleCacheService: Cache purgé avec succès');
      
      // Déclencher un événement pour les autres composants/onglets
      this.dispatchCacheEvent('cache_cleared');
    } catch (e) {
      console.error('ModuleCacheService: Erreur lors de la purge du cache:', e);
    }
  }
  
  // Vérifier si le cache est expiré
  public isModulesCacheExpired(): boolean {
    if (this.memoryModulesCache) {
      return Date.now() - this.memoryModulesCache.timestamp > this.config.modulesExpiryTime;
    }
    
    try {
      const cachedTimestamp = localStorage.getItem(CACHE_KEYS.MODULES_TIMESTAMP);
      
      if (cachedTimestamp) {
        const timestamp = parseInt(cachedTimestamp, 10);
        return Date.now() - timestamp > this.config.modulesExpiryTime;
      }
    } catch (e) {
      console.error('ModuleCacheService: Erreur lors de la vérification de l\'expiration du cache:', e);
    }
    
    return true; // Par défaut, considérer le cache comme expiré
  }
  
  // Configurer le rafraîchissement en arrière-plan
  private setupBackgroundRefresh(): void {
    // Nettoyer l'ancien timer si existant
    if (this.backgroundRefreshTimer !== null) {
      window.clearInterval(this.backgroundRefreshTimer);
    }
    
    // Créer un nouveau timer
    this.backgroundRefreshTimer = window.setInterval(() => {
      this.dispatchCacheEvent('background_refresh_needed');
    }, this.config.backgroundRefreshInterval);
    
    console.log(`ModuleCacheService: Rafraîchissement en arrière-plan configuré avec intervalle de ${this.config.backgroundRefreshInterval}ms`);
  }
  
  // Écouter les événements de cache
  private listenForCacheEvents(): void {
    window.addEventListener('storage', (event) => {
      // Réagir aux changements de cache dans d'autres onglets
      if (event.key === CACHE_KEYS.MODULES || 
          event.key === CACHE_KEYS.MODULES_TIMESTAMP ||
          event.key === CACHE_KEYS.STATUSES ||
          event.key === CACHE_KEYS.STATUSES_TIMESTAMP ||
          event.key === CACHE_KEYS.FEATURES ||
          event.key === CACHE_KEYS.FEATURES_TIMESTAMP) {
        
        console.log(`ModuleCacheService: Détection de changement de cache dans un autre onglet (${event.key})`);
        
        // Invalider les caches en mémoire correspondants
        if (event.key === CACHE_KEYS.MODULES || event.key === CACHE_KEYS.MODULES_TIMESTAMP) {
          this.memoryModulesCache = null;
        } else if (event.key === CACHE_KEYS.STATUSES || event.key === CACHE_KEYS.STATUSES_TIMESTAMP) {
          this.memoryStatusesCache = null;
        } else if (event.key === CACHE_KEYS.FEATURES || event.key === CACHE_KEYS.FEATURES_TIMESTAMP) {
          this.memoryFeaturesCache = null;
        }
        
        // Informer les abonnés du changement
        this.dispatchCacheEvent('external_cache_updated');
      }
    });
  }
  
  // Émettre un événement de cache
  private dispatchCacheEvent(eventName: string): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(eventName));
    }
  }
}

// Créer et exporter une instance unique pour toute l'application
export const moduleCacheService = new ModuleCacheService();
