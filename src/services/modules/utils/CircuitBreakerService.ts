
/**
 * Service de circuit breaker pour éviter les appels répétés en cas d'erreur
 * Permet de court-circuiter temporairement les appels après plusieurs échecs
 */

interface CircuitState {
  failures: number;
  lastFailure: number;
  isOpen: boolean;
  lastReset: number;
}

export class CircuitBreakerService {
  private circuits: Record<string, CircuitState> = {};
  private FAILURE_THRESHOLD = 3;
  private RESET_TIMEOUT_MS = 60000; // 1 minute
  private HALF_OPEN_TIMEOUT_MS = 5000; // 5 secondes

  /**
   * Exécute une opération avec protection par circuit breaker
   * @param operationKey Clé unique pour l'opération
   * @param operation Fonction à exécuter
   * @returns Résultat de l'opération
   */
  async execute<T>(operationKey: string, operation: () => Promise<T>): Promise<T> {
    // Initialiser le circuit si nécessaire
    if (!this.circuits[operationKey]) {
      this.circuits[operationKey] = {
        failures: 0,
        lastFailure: 0,
        isOpen: false,
        lastReset: Date.now()
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
      } else {
        // Circuit toujours ouvert, rejeter l'opération
        console.error(`Circuit ${operationKey} ouvert, opération rejetée`);
        throw new Error(`Opération non disponible (circuit ouvert): ${operationKey}`);
      }
    }
    
    try {
      // Exécuter l'opération
      const result = await operation();
      
      // Réinitialiser les compteurs d'échec en cas de succès
      if (circuit.failures > 0) {
        this.resetCircuit(operationKey);
      }
      
      return result;
    } catch (error) {
      // Incrémenter le compteur d'échecs
      circuit.failures++;
      circuit.lastFailure = Date.now();
      
      // Si le seuil est dépassé, ouvrir le circuit
      if (circuit.failures >= this.FAILURE_THRESHOLD) {
        circuit.isOpen = true;
        console.warn(`Circuit ${operationKey} ouvert après ${circuit.failures} échecs`);
      }
      
      throw error;
    }
  }

  /**
   * Réinitialise l'état d'un circuit
   * @param operationKey Clé du circuit à réinitialiser
   */
  private resetCircuit(operationKey: string): void {
    this.circuits[operationKey] = {
      failures: 0,
      lastFailure: 0,
      isOpen: false,
      lastReset: Date.now()
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
  }
}

// Exporter une instance unique pour toute l'application
export const circuitBreakerService = new CircuitBreakerService();
