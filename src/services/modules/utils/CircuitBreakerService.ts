
import { eventBus } from '@/core/event-bus/EventBus';
import { MODULE_EVENTS } from '../ModuleEvents';

// États possibles du circuit breaker
type CircuitState = 'closed' | 'open' | 'half-open';

// Configuration pour un circuit
interface CircuitConfig {
  failureThreshold: number;       // Nombre d'échecs avant ouverture
  resetTimeout: number;           // Délai avant tentative de rétablissement (ms)
  halfOpenSuccessThreshold: number; // Nombre de succès en half-open avant fermeture
  timeoutDuration: number;        // Durée max d'exécution avant timeout (ms)
}

// État actuel d'un circuit
interface CircuitState {
  state: CircuitState;
  failures: number;
  successes: number;
  lastFailure: number | null;
  lastSuccess: number | null;
  lastAttempt: number | null;
}

class CircuitBreakerService {
  private circuits: Map<string, CircuitState> = new Map();
  private configs: Map<string, CircuitConfig> = new Map();
  private name: string = 'CircuitBreakerService'; // Ajout de la propriété name manquante

  constructor() {
    this.setDefaultConfig('default', {
      failureThreshold: 3,
      resetTimeout: 30000,        // 30 secondes
      halfOpenSuccessThreshold: 2,
      timeoutDuration: 5000       // 5 secondes
    });
  }

  /**
   * Configure un circuit
   * @param name Nom du circuit
   * @param config Configuration
   */
  public setConfig(name: string, config: Partial<CircuitConfig>): void {
    const existingConfig = this.configs.get('default') || {
      failureThreshold: 3,
      resetTimeout: 30000,
      halfOpenSuccessThreshold: 2,
      timeoutDuration: 5000
    };
    
    this.configs.set(name, { ...existingConfig, ...config });
  }

  /**
   * Configure par défaut pour tous les circuits non explicitement configurés
   * @param name Nom de la configuration par défaut (habituellement 'default')
   * @param config Configuration
   */
  public setDefaultConfig(name: string, config: CircuitConfig): void {
    this.configs.set(name, config);
  }

  /**
   * Exécute une fonction avec protection par circuit breaker
   * @param circuitName Nom du circuit
   * @param fn Fonction à exécuter
   * @returns Résultat de la fonction
   */
  public async execute<T>(circuitName: string, fn: () => Promise<T>): Promise<T> {
    // Créer ou récupérer l'état du circuit
    if (!this.circuits.has(circuitName)) {
      this.circuits.set(circuitName, {
        state: 'closed',
        failures: 0,
        successes: 0,
        lastFailure: null,
        lastSuccess: null,
        lastAttempt: null
      });
    }

    const circuitState = this.circuits.get(circuitName)!;
    const config = this.configs.get(circuitName) || this.configs.get('default')!;
    
    // Vérifier si le circuit est ouvert
    if (circuitState.state === 'open') {
      const now = Date.now();
      const resetTimeout = config.resetTimeout;
      
      // Vérifier si le délai de réinitialisation est écoulé
      if (circuitState.lastFailure !== null && (now - circuitState.lastFailure) > resetTimeout) {
        // Transition vers l'état half-open
        circuitState.state = 'half-open';
        circuitState.successes = 0;
        
        // Publier un événement de changement d'état
        eventBus.publish(MODULE_EVENTS.CIRCUIT_HALF_OPEN, {
          circuit: circuitName,
          service: this.name,
          timestamp: now
        });
        
        console.log(`Circuit ${circuitName} entering half-open state after timeout`);
      } else {
        // Circuit toujours ouvert, rejeter immédiatement
        console.log(`Circuit ${circuitName} is open, request rejected`);
        throw new Error(`Circuit ${circuitName} is open`);
      }
    }

    // Tenter d'exécuter la fonction protégée
    try {
      // Enregistrer la tentative
      circuitState.lastAttempt = Date.now();
      
      // Exécuter avec un timeout
      const result = await this.executeWithTimeout(fn, config.timeoutDuration);
      
      // Succès - mise à jour des compteurs
      circuitState.lastSuccess = Date.now();
      circuitState.failures = 0;
      circuitState.successes++;
      
      // Si en half-open et assez de succès, fermer le circuit
      if (circuitState.state === 'half-open' && circuitState.successes >= config.halfOpenSuccessThreshold) {
        circuitState.state = 'closed';
        
        // Publier un événement de changement d'état
        eventBus.publish(MODULE_EVENTS.CIRCUIT_CLOSED, {
          circuit: circuitName,
          service: this.name,
          timestamp: Date.now()
        });
        
        console.log(`Circuit ${circuitName} closed after ${circuitState.successes} successes in half-open state`);
      }
      
      return result;
    } catch (error) {
      // Échec - mise à jour des compteurs
      circuitState.lastFailure = Date.now();
      circuitState.failures++;
      circuitState.successes = 0;
      
      // Si en closed/half-open et trop d'échecs, ouvrir le circuit
      if (circuitState.failures >= config.failureThreshold) {
        const previousState = circuitState.state;
        circuitState.state = 'open';
        
        // Publier un événement de changement d'état
        eventBus.publish(MODULE_EVENTS.CIRCUIT_OPENED, {
          circuit: circuitName,
          service: this.name,
          error: error.message,
          failures: circuitState.failures,
          timestamp: Date.now(),
          previousState
        });
        
        console.log(`Circuit ${circuitName} opened after ${circuitState.failures} failures`);
      }
      
      throw error;
    }
  }

  /**
   * Exécute une fonction avec un timeout
   * @param fn Fonction à exécuter
   * @param timeout Délai de timeout en ms
   * @returns Résultat de la fonction
   */
  private async executeWithTimeout<T>(fn: () => Promise<T>, timeout: number): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Execution timed out after ${timeout}ms`));
      }, timeout);
      
      fn().then(
        result => {
          clearTimeout(timeoutId);
          resolve(result);
        },
        error => {
          clearTimeout(timeoutId);
          reject(error);
        }
      );
    });
  }

  /**
   * Réinitialise l'état d'un circuit
   * @param circuitName Nom du circuit
   */
  public resetCircuit(circuitName: string): void {
    this.circuits.set(circuitName, {
      state: 'closed',
      failures: 0,
      successes: 0,
      lastFailure: null,
      lastSuccess: null,
      lastAttempt: null
    });
    
    console.log(`Circuit ${circuitName} manually reset to closed state`);
  }

  /**
   * Réinitialise tous les circuits
   */
  public resetAllCircuits(): void {
    this.circuits.clear();
    console.log('All circuits reset');
  }
}

// Exporter une instance unique
export const circuitBreakerService = new CircuitBreakerService();
