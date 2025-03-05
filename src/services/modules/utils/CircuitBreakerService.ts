/**
 * Service de circuit breaker pour éviter les appels répétés en cas d'erreur
 * Permet de court-circuiter temporairement les appels après plusieurs échecs
 */
import { eventBus } from '@/core/event-bus/EventBus';
import { MODULE_EVENTS } from '@/services/modules/ModuleEvents';

interface CircuitState {
  failures: number;
  lastFailure: number;
  isOpen: boolean;
  lastReset: number;
  consecutiveSuccesses: number;
  halfOpenAttempts: number;
  totalFailures: number;
  totalSuccesses: number;
}

export class CircuitBreakerService {
  private circuits: Record<string, CircuitState> = {};
  private FAILURE_THRESHOLD = 3;
  private RESET_TIMEOUT_MS = 60000; // 1 minute
  private HALF_OPEN_TIMEOUT_MS = 5000; // 5 secondes
  private SUCCESS_THRESHOLD = 2; // Nombre de succès consécutifs pour fermer le circuit
  private MAX_RETRY_ATTEMPTS = 5; // Nombre maximum de tentatives avant échec définitif

  /**
   * Configure les paramètres du circuit breaker
   * @param config Configuration du circuit breaker
   */
  configure(config: {
    failureThreshold?: number;
    resetTimeoutMs?: number;
    halfOpenTimeoutMs?: number;
    successThreshold?: number;
    maxRetryAttempts?: number;
  }): void {
    if (config.failureThreshold !== undefined) this.FAILURE_THRESHOLD = config.failureThreshold;
    if (config.resetTimeoutMs !== undefined) this.RESET_TIMEOUT_MS = config.resetTimeoutMs;
    if (config.halfOpenTimeoutMs !== undefined) this.HALF_OPEN_TIMEOUT_MS = config.halfOpenTimeoutMs;
    if (config.successThreshold !== undefined) this.SUCCESS_THRESHOLD = config.successThreshold;
    if (config.maxRetryAttempts !== undefined) this.MAX_RETRY_ATTEMPTS = config.maxRetryAttempts;
  }

  /**
   * Exécute une opération avec protection par circuit breaker
   * @param operationKey Clé unique pour l'opération
   * @param operation Fonction à exécuter
   * @param options Options d'exécution
   * @returns Résultat de l'opération
   */
  async execute<T>(
    operationKey: string, 
    operation: () => Promise<T>,
    options: { 
      timeout?: number;
      fallback?: () => Promise<T>;
      silentErrors?: boolean;
    } = {}
  ): Promise<T> {
    // Initialiser le circuit si nécessaire
    if (!this.circuits[operationKey]) {
      this.circuits[operationKey] = {
        failures: 0,
        lastFailure: 0,
        isOpen: false,
        lastReset: Date.now(),
        consecutiveSuccesses: 0,
        halfOpenAttempts: 0,
        totalFailures: 0,
        totalSuccesses: 0
      };
    }
    
    const circuit = this.circuits[operationKey];
    
    // Vérifier si le circuit est ouvert (erreurs récentes)
    if (circuit.isOpen) {
      const timeSinceLastFailure = Date.now() - circuit.lastFailure;
      
      // Si le temps de reset est écoulé, tenter de réinitialiser le circuit
      if (timeSinceLastFailure > this.RESET_TIMEOUT_MS) {
        this.resetCircuit(operationKey);
      } else if (timeSinceLastFailure > this.HALF_OPEN_TIMEOUT_MS) {
        // Si le temps de semi-ouverture est écoulé, permettre une tentative
        console.log(`Circuit ${operationKey} semi-ouvert, autorisant une tentative`);
        
        // Passer en mode semi-ouvert
        circuit.isOpen = false;
        circuit.halfOpenAttempts++;
        
        // Publier un événement de circuit semi-ouvert
        eventBus.publish(MODULE_EVENTS.MODULE_STATUS_CHANGED, {
          status: 'half_open',
          service: this.name,
          timestamp: Date.now(),
          attempts: circuit.halfOpenAttempts
        });
      } else {
        // Circuit toujours ouvert, essayer le fallback si disponible
        if (options.fallback) {
          console.log(`Circuit ${operationKey} ouvert, utilisation du fallback`);
          try {
            return await options.fallback();
          } catch (fallbackError: any) {
            // Si le fallback échoue également, journaliser mais ne pas modifier l'état du circuit
            console.error(`Fallback pour ${operationKey} a échoué:`, fallbackError?.message || fallbackError);
            
            if (!options.silentErrors) {
              // Publier un événement d'erreur
              eventBus.publish(MODULE_EVENTS.MODULE_ERROR, {
                error: `Fallback pour ${operationKey} a échoué`,
                context: 'circuit_breaker_fallback',
                timestamp: Date.now(),
                details: fallbackError
              });
            }
            
            throw new Error(`Circuit ouvert pour ${operationKey} et fallback échoué: ${fallbackError?.message || 'Erreur inconnue'}`);
          }
        }
        
        // Sinon rejeter l'opération
        console.error(`Circuit ${operationKey} ouvert, opération rejetée`);
        throw new Error(`Opération non disponible (circuit ouvert): ${operationKey}. Réessayez plus tard.`);
      }
    }
    
    try {
      // Exécuter l'opération avec timeout si configuré
      let result: T;
      
      if (options.timeout) {
        result = await this.executeWithTimeout(operation, options.timeout);
      } else {
        result = await operation();
      }
      
      // Gérer le succès
      if (circuit.halfOpenAttempts > 0) {
        // Si le circuit était en mode semi-ouvert, incrémenter le compteur de succès
        circuit.consecutiveSuccesses++;
        
        // Si nous atteignons le seuil de succès, fermer le circuit
        if (circuit.consecutiveSuccesses >= this.SUCCESS_THRESHOLD) {
          console.log(`Circuit ${operationKey} fermé après ${circuit.consecutiveSuccesses} succès consécutifs`);
          this.resetCircuit(operationKey);
          
          // Publier un événement de circuit fermé
          eventBus.publish(MODULE_EVENTS.MODULE_STATUS_CHANGED, {
            status: 'closed',
            service: this.name,
            timestamp: Date.now()
          });
        }
      } else if (circuit.failures > 0) {
        // Réinitialiser progressivement les compteurs d'échec
        circuit.failures = Math.max(0, circuit.failures - 1);
        circuit.consecutiveSuccesses++;
      }
      
      // Incrémenter le compteur total de succès
      circuit.totalSuccesses++;
      
      return result;
    } catch (error: any) {
      // Incrémenter le compteur d'échecs
      circuit.failures++;
      circuit.lastFailure = Date.now();
      circuit.consecutiveSuccesses = 0;
      circuit.totalFailures++;
      
      // Si le seuil est dépassé, ouvrir le circuit
      if (circuit.failures >= this.FAILURE_THRESHOLD) {
        circuit.isOpen = true;
        console.warn(`Circuit ${operationKey} ouvert après ${circuit.failures} échecs`);
        
        // Publier un événement de circuit ouvert
        eventBus.publish(MODULE_EVENTS.MODULE_STATUS_CHANGED, {
          status: 'opened',
          service: this.name,
          timestamp: Date.now(),
          failures: circuit.failures,
          reason: error?.message || 'Trop d\'échecs consécutifs'
        });
      }
      
      if (!options.silentErrors) {
        // Publier un événement d'erreur
        eventBus.publish(MODULE_EVENTS.MODULE_ERROR, {
          error: `Erreur dans ${operationKey}: ${error?.message || 'Erreur inconnue'}`,
          context: 'circuit_breaker_operation',
          timestamp: Date.now(),
          details: error
        });
      }
      
      // Essayer le fallback si disponible
      if (options.fallback) {
        console.log(`Échec de l'opération ${operationKey}, utilisation du fallback`);
        try {
          return await options.fallback();
        } catch (fallbackError: any) {
          console.error(`Échec du fallback pour ${operationKey}:`, fallbackError?.message || fallbackError);
          
          if (!options.silentErrors) {
            // Publier un événement d'erreur
            eventBus.publish(MODULE_EVENTS.MODULE_ERROR, {
              error: `Fallback pour ${operationKey} a échoué`,
              context: 'circuit_breaker_fallback',
              timestamp: Date.now(),
              details: fallbackError
            });
          }
          
          throw error; // Renvoyer l'erreur originale
        }
      }
      
      throw error;
    }
  }

  /**
   * Exécute une opération avec un timeout
   * @param operation Fonction à exécuter
   * @param timeoutMs Délai avant timeout
   * @returns Résultat de l'opération
   */
  private executeWithTimeout<T>(operation: () => Promise<T>, timeoutMs: number): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Opération expirée après ${timeoutMs}ms`));
      }, timeoutMs);
      
      operation()
        .then(result => {
          clearTimeout(timeoutId);
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  }

  /**
   * Réinitialise l'état d'un circuit
   * @param operationKey Clé du circuit à réinitialiser
   */
  private resetCircuit(operationKey: string): void {
    const oldStats = this.circuits[operationKey] || {
      totalFailures: 0,
      totalSuccesses: 0
    };
    
    this.circuits[operationKey] = {
      failures: 0,
      lastFailure: 0,
      isOpen: false,
      lastReset: Date.now(),
      consecutiveSuccesses: 0,
      halfOpenAttempts: 0,
      // Conserver les statistiques globales
      totalFailures: oldStats.totalFailures,
      totalSuccesses: oldStats.totalSuccesses
    };
    console.log(`Circuit ${operationKey} réinitialisé`);
  }

  /**
   * Réinitialise tous les circuits
   */
  resetAllCircuits(): void {
    Object.keys(this.circuits).forEach(key => {
      this.resetCircuit(key);
    });
    console.log("Tous les circuits ont été réinitialisés");
  }

  /**
   * Récupère l'état actuel d'un circuit
   * @param operationKey Clé du circuit
   * @returns État du circuit
   */
  getCircuitState(operationKey: string): { 
    isOpen: boolean; 
    failures: number; 
    lastFailure: number; 
    timeSinceLastFailure: number;
    consecutiveSuccesses: number;
    halfOpenAttempts: number;
    totalFailures: number;
    totalSuccesses: number;
    healthScore: number; // Score de 0 à 100
  } | null {
    const circuit = this.circuits[operationKey];
    
    if (!circuit) return null;
    
    // Calculer un score de santé basé sur les réussites/échecs
    const totalOperations = circuit.totalSuccesses + circuit.totalFailures;
    const healthScore = totalOperations > 0
      ? Math.min(100, Math.max(0, Math.round((circuit.totalSuccesses / totalOperations) * 100)))
      : 100; // 100% par défaut s'il n'y a pas d'opérations
    
    return {
      isOpen: circuit.isOpen,
      failures: circuit.failures,
      lastFailure: circuit.lastFailure,
      timeSinceLastFailure: Date.now() - circuit.lastFailure,
      consecutiveSuccesses: circuit.consecutiveSuccesses,
      halfOpenAttempts: circuit.halfOpenAttempts,
      totalFailures: circuit.totalFailures,
      totalSuccesses: circuit.totalSuccesses,
      healthScore
    };
  }
  
  /**
   * Vérifie si un circuit est ouvert
   * @param operationKey Clé du circuit
   * @returns True si le circuit est ouvert
   */
  isCircuitOpen(operationKey: string): boolean {
    const circuit = this.circuits[operationKey];
    return circuit ? circuit.isOpen : false;
  }
  
  /**
   * Récupère les statistiques de tous les circuits
   * @returns Statistiques des circuits
   */
  getAllCircuitStats(): Record<string, {
    isOpen: boolean;
    failures: number;
    healthScore: number;
    operationCount: number;
  }> {
    const stats: Record<string, any> = {};
    
    Object.entries(this.circuits).forEach(([key, circuit]) => {
      const totalOperations = circuit.totalSuccesses + circuit.totalFailures;
      const healthScore = totalOperations > 0
        ? Math.min(100, Math.max(0, Math.round((circuit.totalSuccesses / totalOperations) * 100)))
        : 100;
      
      stats[key] = {
        isOpen: circuit.isOpen,
        failures: circuit.failures,
        healthScore,
        operationCount: totalOperations
      };
    });
    
    return stats;
  }
}

// Exporter une instance unique pour toute l'application
export const circuitBreakerService = new CircuitBreakerService();
