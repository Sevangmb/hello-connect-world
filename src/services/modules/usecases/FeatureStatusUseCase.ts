
/**
 * Cas d'utilisation pour la gestion des statuts de fonctionnalités
 * Centralise la logique métier liée aux fonctionnalités
 */
import { featureRepository } from '../repositories/FeatureRepository';
import { moduleStatusUseCase } from './ModuleStatusUseCase';
import { eventBus } from '@/core/event-bus/EventBus';
import { MODULE_EVENTS } from '../ModuleEvents';

export class FeatureStatusUseCase {
  // Cache pour les vérifications répétées
  private featureStatusCache: Record<string, { enabled: boolean, timestamp: number }> = {};
  private CACHE_VALIDITY_MS = 30000; // 30 secondes

  constructor() {}

  /**
   * Met à jour le statut d'une fonctionnalité et gère les événements liés
   * @param moduleCode Code du module
   * @param featureCode Code de la fonctionnalité
   * @param isEnabled Statut d'activation
   * @returns Promise<boolean> True si la mise à jour a réussi
   */
  async updateFeatureStatus(moduleCode: string, featureCode: string, isEnabled: boolean): Promise<boolean> {
    try {
      // Mettre à jour dans la base de données
      const success = await featureRepository.updateFeatureStatus(moduleCode, featureCode, isEnabled);
      
      if (success) {
        // Mettre à jour le cache
        const cacheKey = `${moduleCode}:${featureCode}`;
        this.featureStatusCache[cacheKey] = {
          enabled: isEnabled,
          timestamp: Date.now()
        };
        
        // Publier un événement de changement de statut de fonctionnalité
        eventBus.publish(MODULE_EVENTS.FEATURE_STATUS_CHANGED, {
          moduleCode,
          featureCode,
          isEnabled,
          timestamp: Date.now()
        });
        
        // Publier un événement spécifique selon le nouveau statut
        if (isEnabled) {
          eventBus.publish(MODULE_EVENTS.FEATURE_ACTIVATED, {
            moduleCode,
            featureCode,
            timestamp: Date.now()
          });
        } else {
          eventBus.publish(MODULE_EVENTS.FEATURE_DEACTIVATED, {
            moduleCode,
            featureCode,
            timestamp: Date.now()
          });
        }
      }
      
      return success;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut de la fonctionnalité:", error);
      eventBus.publish(MODULE_EVENTS.MODULE_ERROR, {
        error: `Erreur lors de la mise à jour du statut de la fonctionnalité: ${error}`,
        context: "update_feature",
        timestamp: Date.now()
      });
      return false;
    }
  }

  /**
   * Vérifie si une fonctionnalité est activée
   * @param moduleCode Code du module
   * @param featureCode Code de la fonctionnalité
   * @param features Données des fonctionnalités (optionnel)
   * @returns boolean True si la fonctionnalité est activée
   */
  isFeatureEnabled(
    moduleCode: string, 
    featureCode: string, 
    features?: Record<string, Record<string, boolean>>
  ): boolean {
    // Administrateur a toujours toutes les fonctionnalités activées
    if (moduleCode === 'admin' || moduleCode.startsWith('admin_')) {
      return true;
    }
    
    // Vérifier d'abord si le module est actif
    if (!moduleStatusUseCase.isModuleActive(moduleCode)) {
      return false;
    }
    
    // Vérifier le cache
    const cacheKey = `${moduleCode}:${featureCode}`;
    const cached = this.featureStatusCache[cacheKey];
    if (cached && (Date.now() - cached.timestamp < this.CACHE_VALIDITY_MS)) {
      return cached.enabled;
    }
    
    // Si features est fourni, vérifier dedans
    if (features) {
      const isEnabled = features[moduleCode]?.[featureCode] === true;
      // Mettre à jour le cache
      this.featureStatusCache[cacheKey] = {
        enabled: isEnabled,
        timestamp: Date.now()
      };
      return isEnabled;
    }
    
    return false;
  }

  /**
   * Met à jour le cache des statuts de fonctionnalités
   * @param features Données des fonctionnalités à mettre en cache
   */
  updateFeatureCache(features: Record<string, Record<string, boolean>>): void {
    Object.entries(features).forEach(([moduleCode, moduleFeatures]) => {
      Object.entries(moduleFeatures).forEach(([featureCode, isEnabled]) => {
        const cacheKey = `${moduleCode}:${featureCode}`;
        this.featureStatusCache[cacheKey] = {
          enabled: isEnabled,
          timestamp: Date.now()
        };
      });
    });
  }
}

// Exporter une instance unique pour toute l'application
export const featureStatusUseCase = new FeatureStatusUseCase();
