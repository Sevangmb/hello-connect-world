
/**
 * Service d'optimisation des modules
 * Gère le préchargement intelligent et prioritisé des modules
 */
import { supabase } from '@/integrations/supabase/client';
import { AppModule } from '@/hooks/modules/types';

class ModuleOptimizer {
  private priorityModules: string[] = ['auth', 'core', 'admin'];
  private preloadedModules: Set<string> = new Set();
  private isInitialized: boolean = false;
  private cacheTimestamp: number = 0;
  private CACHE_VALIDITY = 60000; // 1 minute

  constructor() {
    // Initialiser au démarrage
    this.initialize();
  }

  /**
   * Initialise le service d'optimisation
   */
  private async initialize(): Promise<void> {
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
    // Précharger en arrière-plan les modules prioritaires
    try {
      await Promise.all(
        this.priorityModules.map(moduleCode => this.preloadModule(moduleCode))
      );
      console.log('Préchargement des modules prioritaires terminé');
    } catch (err) {
      console.error('Erreur lors du préchargement des modules prioritaires:', err);
    }
  }

  /**
   * Précharge un module spécifique
   */
  public async preloadModule(moduleCode: string): Promise<void> {
    if (this.preloadedModules.has(moduleCode)) return;

    try {
      // Marquer comme préchargé pour éviter les duplications
      this.preloadedModules.add(moduleCode);
      
      // Précharger les données du module
      const { data } = await supabase
        .from('app_modules')
        .select('*')
        .eq('code', moduleCode)
        .single();
      
      if (data) {
        // Mettre en cache les données du module
        const moduleCache = localStorage.getItem('modules_cache') || '{}';
        const modulesData = JSON.parse(moduleCache);
        modulesData[moduleCode] = {
          data,
          timestamp: Date.now()
        };
        localStorage.setItem('modules_cache', JSON.stringify(modulesData));
        
        console.log(`Module ${moduleCode} préchargé avec succès`);
        
        // Précharger également les fonctionnalités du module
        this.preloadModuleFeatures(moduleCode);
        
        // Incrémenter les statistiques d'utilisation
        await this.recordModuleUsage(moduleCode);
      }
    } catch (error) {
      console.error(`Erreur lors du préchargement du module ${moduleCode}:`, error);
    }
  }

  /**
   * Précharge les fonctionnalités d'un module
   */
  private async preloadModuleFeatures(moduleCode: string): Promise<void> {
    try {
      const { data } = await supabase
        .from('module_features')
        .select('*')
        .eq('module_code', moduleCode);
      
      if (data && data.length > 0) {
        // Mettre en cache les fonctionnalités
        const featuresCache = localStorage.getItem('features_cache') || '{}';
        const featuresData = JSON.parse(featuresCache);
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
   * Enregistre l'utilisation d'un module
   */
  public async recordModuleUsage(moduleCode: string): Promise<void> {
    try {
      // Utiliser la fonction RPC pour incrémenter l'utilisation
      const { error } = await supabase
        .rpc('increment_module_usage', { module_code: moduleCode });
      
      if (error) {
        console.error(`Erreur lors de l'enregistrement de l'utilisation du module ${moduleCode}:`, error);
      }
    } catch (error) {
      console.error(`Erreur lors de l'enregistrement de l'utilisation du module ${moduleCode}:`, error);
    }
  }

  /**
   * Met à jour les priorités des modules en fonction de l'utilisation
   */
  private async updateModulePriorities(): Promise<void> {
    try {
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
        
        console.log('Priorités de modules mises à jour:', this.priorityModules);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des priorités de modules:', error);
    }
  }
}

// Exporter une instance singleton
export const moduleOptimizer = new ModuleOptimizer();
