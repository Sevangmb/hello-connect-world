
/**
 * Service d'optimisation des modules
 * Gère le préchargement intelligent et prioritisé des modules avec mise en cache
 */
import { supabase } from '@/integrations/supabase/client';
import { AppModule } from '@/hooks/modules/types';

class ModuleOptimizer {
  private priorityModules: string[] = ['auth', 'core', 'admin'];
  private preloadedModules: Set<string> = new Set();
  private isInitialized: boolean = false;
  private cacheTimestamp: number = 0;
  private initializationPromise: Promise<void> | null = null;
  private CACHE_VALIDITY = 60000; // 1 minute

  constructor() {
    // Initialiser au démarrage de manière asynchrone pour ne pas bloquer le thread principal
    setTimeout(() => this.initialize(), 0);
  }

  /**
   * Initialise le service d'optimisation avec promesse réutilisable
   */
  private async initialize(): Promise<void> {
    // Éviter les initialisations multiples avec une promesse réutilisable
    if (this.initializationPromise) {
      return this.initializationPromise;
    }
    
    this.initializationPromise = (async () => {
      // Ne pas réinitialiser si déjà fait
      if (this.isInitialized) return;
  
      // Récupérer les priorités de module depuis le cache si disponible
      const cachedPriorities = localStorage.getItem('module_priorities');
      if (cachedPriorities) {
        try {
          const parsedPriorities = JSON.parse(cachedPriorities);
          if (Array.isArray(parsedPriorities) && parsedPriorities.length > 0) {
            this.priorityModules = parsedPriorities;
            console.log('Priorités de modules chargées depuis le cache:', this.priorityModules);
          }
        } catch (e) {
          console.error('Erreur lors du chargement des priorités de modules:', e);
          // Continuer avec les priorités par défaut
        }
      }
  
      // Marquer comme initialisé
      this.isInitialized = true;
      this.cacheTimestamp = Date.now();
      
      // Mettre à jour les priorités en arrière-plan
      this.updateModulePriorities();
    })();
    
    return this.initializationPromise;
  }

  /**
   * Vérifie si le cache est valide
   */
  public isCacheValid(): boolean {
    return Date.now() - this.cacheTimestamp < this.CACHE_VALIDITY;
  }

  /**
   * Précharge les modules prioritaires
   */
  public async preloadPriorityModules(): Promise<void> {
    // S'assurer que l'initialisation est terminée
    await this.initialize();
    
    // Précharger en arrière-plan les modules prioritaires avec un délai pour ne pas bloquer le thread principal
    try {
      // Diviser les modules en lots pour ne pas surcharger le navigateur
      const batchSize = 2;
      for (let i = 0; i < this.priorityModules.length; i += batchSize) {
        const batch = this.priorityModules.slice(i, i + batchSize);
        
        // Précharger le lot de modules en parallèle
        await Promise.all(
          batch.map(moduleCode => this.preloadModule(moduleCode))
        );
        
        // Petite pause entre les lots pour éviter de surcharger le navigateur
        if (i + batchSize < this.priorityModules.length) {
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      }
      
      console.log('Préchargement des modules prioritaires terminé');
    } catch (err) {
      console.error('Erreur lors du préchargement des modules prioritaires:', err);
    }
  }

  /**
   * Précharge un module spécifique avec optimisation de la requête
   */
  public async preloadModule(moduleCode: string): Promise<void> {
    // Éviter les préchargements en double
    if (this.preloadedModules.has(moduleCode)) return;

    try {
      // Marquer comme préchargé pour éviter les duplications
      this.preloadedModules.add(moduleCode);
      
      // Vérifier d'abord dans le cache
      const moduleCache = localStorage.getItem('modules_cache') || '{}';
      const modulesData = JSON.parse(moduleCache);
      
      if (modulesData[moduleCode] && 
          (Date.now() - modulesData[moduleCode].timestamp < 300000)) { // 5 minutes
        // Utiliser la version en cache
        console.log(`Module ${moduleCode} chargé depuis le cache`);
      } else {
        // Précharger les données du module depuis Supabase
        const { data } = await supabase
          .from('app_modules')
          .select('*')
          .eq('code', moduleCode)
          .single();
        
        if (data) {
          // Mettre en cache les données du module
          modulesData[moduleCode] = {
            data,
            timestamp: Date.now()
          };
          localStorage.setItem('modules_cache', JSON.stringify(modulesData));
          
          console.log(`Module ${moduleCode} préchargé avec succès`);
          
          // Précharger les fonctionnalités du module en arrière-plan
          setTimeout(() => this.preloadModuleFeatures(moduleCode), 100);
          
          // Incrémenter les statistiques d'utilisation en arrière-plan
          setTimeout(() => this.recordModuleUsage(moduleCode), 200);
        }
      }
    } catch (error) {
      console.error(`Erreur lors du préchargement du module ${moduleCode}:`, error);
    }
  }

  /**
   * Précharge les fonctionnalités d'un module avec mise en cache
   */
  private async preloadModuleFeatures(moduleCode: string): Promise<void> {
    try {
      // Vérifier d'abord dans le cache
      const featuresCache = localStorage.getItem('features_cache') || '{}';
      const featuresData = JSON.parse(featuresCache);
      
      if (featuresData[moduleCode] && 
          (Date.now() - featuresData[moduleCode].timestamp < 300000)) { // 5 minutes
        // Utiliser la version en cache
        console.log(`Fonctionnalités du module ${moduleCode} chargées depuis le cache`);
        return;
      }
      
      // Si pas en cache ou cache expiré, charger depuis Supabase
      const { data } = await supabase
        .from('module_features')
        .select('*')
        .eq('module_code', moduleCode);
      
      if (data && data.length > 0) {
        // Mettre en cache les fonctionnalités
        featuresData[moduleCode] = {
          data,
          timestamp: Date.now()
        };
        localStorage.setItem('features_cache', JSON.stringify(featuresData));
        
        console.log(`Fonctionnalités du module ${moduleCode} préchargées avec succès`);
      }
    } catch (error) {
      console.error(`Erreur lors du préchargement des fonctionnalités du module ${moduleCode}:`, error);
    }
  }

  /**
   * Enregistre l'utilisation d'un module avec limitation de débit
   */
  public async recordModuleUsage(moduleCode: string): Promise<void> {
    try {
      // Limiter les appels à l'API de tracking
      const usageTrackingKey = `module_usage_tracked_${moduleCode}`;
      const lastTracked = localStorage.getItem(usageTrackingKey);
      
      // N'enregistrer l'utilisation que toutes les 15 minutes pour le même module
      if (lastTracked && (Date.now() - parseInt(lastTracked, 10) < 900000)) {
        return;
      }
      
      // Utiliser la fonction RPC pour incrémenter l'utilisation
      const { error } = await supabase
        .rpc('increment_module_usage', { module_code: moduleCode });
      
      if (error) {
        console.error(`Erreur lors de l'enregistrement de l'utilisation du module ${moduleCode}:`, error);
        return;
      }
      
      // Marquer le module comme suivi
      localStorage.setItem(usageTrackingKey, Date.now().toString());
    } catch (error) {
      console.error(`Erreur lors de l'enregistrement de l'utilisation du module ${moduleCode}:`, error);
    }
  }

  /**
   * Met à jour les priorités des modules en fonction de l'utilisation avec cache
   */
  private async updateModulePriorities(): Promise<void> {
    try {
      // Vérifier si la mise à jour est nécessaire (pas plus d'une fois par heure)
      const lastUpdate = localStorage.getItem('module_priorities_updated');
      if (lastUpdate && (Date.now() - parseInt(lastUpdate, 10) < 3600000)) {
        return;
      }
      
      // Récupérer les statistiques d'utilisation des modules
      const { data, error } = await supabase
        .from('module_usage_stats')
        .select('module_code, usage_count')
        .order('usage_count', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Erreur lors de la récupération des statistiques d\'utilisation:', error);
        return;
      }
      
      if (data && data.length > 0) {
        // Extraire les codes de module par ordre de priorité
        const newPriorities = data.map(stat => stat.module_code);
        
        // Fusionner avec les priorités existantes
        const mergedPriorities = [...new Set([...newPriorities, ...this.priorityModules])];
        
        // Mettre à jour les priorités
        this.priorityModules = mergedPriorities;
        
        // Mettre en cache les nouvelles priorités
        localStorage.setItem('module_priorities', JSON.stringify(this.priorityModules));
        localStorage.setItem('module_priorities_updated', Date.now().toString());
        
        console.log('Priorités de modules mises à jour:', this.priorityModules);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des priorités de modules:', error);
    }
  }
  
  /**
   * Nettoie les caches expirés pour libérer de l'espace
   */
  public cleanupExpiredCaches(): void {
    try {
      // Liste des clés de cache à vérifier
      const cacheKeys = [
        { key: 'modules_cache', expiryMs: 86400000 }, // 24 heures
        { key: 'features_cache', expiryMs: 86400000 }, // 24 heures
        { key: 'user_clothes_cache', expiryMs: 3600000 }, // 1 heure
        { key: 'user_outfits_cache', expiryMs: 3600000 }, // 1 heure
        { key: 'user_favorites_cache', expiryMs: 3600000 } // 1 heure
      ];
      
      cacheKeys.forEach(({ key, expiryMs }) => {
        const cache = localStorage.getItem(key);
        if (cache) {
          try {
            const parsedCache = JSON.parse(cache);
            
            // Si c'est un objet avec un timestamp global
            if (parsedCache.timestamp && (Date.now() - parsedCache.timestamp > expiryMs)) {
              localStorage.removeItem(key);
              console.log(`Cache expiré supprimé: ${key}`);
              return;
            }
            
            // Si c'est un dictionnaire d'objets avec des timestamps individuels
            if (typeof parsedCache === 'object') {
              let hasValidEntries = false;
              let modified = false;
              
              // Parcourir toutes les entrées et supprimer celles qui sont expirées
              Object.keys(parsedCache).forEach(entryKey => {
                const entry = parsedCache[entryKey];
                if (entry.timestamp && (Date.now() - entry.timestamp > expiryMs)) {
                  delete parsedCache[entryKey];
                  modified = true;
                } else {
                  hasValidEntries = true;
                }
              });
              
              // Mettre à jour le cache ou le supprimer complètement
              if (!hasValidEntries) {
                localStorage.removeItem(key);
                console.log(`Cache vide supprimé: ${key}`);
              } else if (modified) {
                localStorage.setItem(key, JSON.stringify(parsedCache));
                console.log(`Cache nettoyé: ${key}`);
              }
            }
          } catch (e) {
            console.warn(`Erreur lors du nettoyage du cache ${key}:`, e);
          }
        }
      });
    } catch (e) {
      console.error('Erreur lors du nettoyage des caches:', e);
    }
  }
}

// Exporter une instance singleton
export const moduleOptimizer = new ModuleOptimizer();

// Nettoyer automatiquement les caches expirés lors du chargement
setTimeout(() => moduleOptimizer.cleanupExpiredCaches(), 5000);

