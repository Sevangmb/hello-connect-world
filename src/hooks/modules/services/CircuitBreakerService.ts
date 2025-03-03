
/**
 * Service implémentant le pattern Circuit Breaker pour les appels à Supabase
 * Permet d'éviter les appels répétés lorsque le service est indisponible
 */

interface CircuitBreakerConfig {
  failureThreshold: number;      // Nombre d'échecs avant de passer en état ouvert
  resetTimeout: number;          // Délai avant de tenter un reset (ms)
  maxResetAttempts: number;      // Nombre maximum de tentatives de reset
  timeoutDuration: number;       // Délai avant d'échouer une requête (ms)
}

// États possibles du circuit
type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

// Configuration par défaut
const DEFAULT_CONFIG: CircuitBreakerConfig = {
  failureThreshold: 3,
  resetTimeout: 30000,        // 30 secondes
  maxResetAttempts: 5,
  timeoutDuration: 5000       // 5 secondes
};

class CircuitBreakerService {
  private state: CircuitState = 'CLOSED';
  private failureCount: number = 0;
  private lastFailureTime: number = 0;
  private resetAttempts: number = 0;
  private config: CircuitBreakerConfig;
  private serviceState: Record<string, CircuitState> = {};

  constructor(config: Partial<CircuitBreakerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Exécuter une fonction avec le pattern Circuit Breaker
   * @param serviceKey Identifiant unique du service (ex: 'modulesApi', 'featuresApi')
   * @param fn Fonction à exécuter
   * @returns Résultat de la fonction ou erreur si le circuit est ouvert
   */
  async execute<T>(serviceKey: string, fn: () => Promise<T>): Promise<T> {
    // Initialiser l'état du service s'il n'existe pas
    if (!this.serviceState[serviceKey]) {
      this.serviceState[serviceKey] = 'CLOSED';
    }

    // Vérifier l'état du circuit pour ce service
    if (this.serviceState[serviceKey] === 'OPEN') {
      // Vérifier si le délai de reset est passé
      const now = Date.now();
      if (now - this.lastFailureTime >= this.config.resetTimeout) {
        console.log(`CircuitBreaker: Passage en HALF_OPEN pour ${serviceKey}`);
        this.serviceState[serviceKey] = 'HALF_OPEN';
      } else {
        // Circuit ouvert, on rejette immédiatement la requête
        throw new Error(`Circuit ouvert pour ${serviceKey}. Réessayez plus tard.`);
      }
    }

    // Exécuter avec un timeout
    try {
      const result = await this.executeWithTimeout(fn, this.config.timeoutDuration);
      
      // Si on était en HALF_OPEN, on revient en CLOSED
      if (this.serviceState[serviceKey] === 'HALF_OPEN') {
        console.log(`CircuitBreaker: Passage en CLOSED pour ${serviceKey} (succès après reset)`);
        this.serviceState[serviceKey] = 'CLOSED';
        this.failureCount = 0;
        this.resetAttempts = 0;
      }
      
      return result;
    } catch (error) {
      // Incrémenter le compteur d'échecs
      this.failureCount++;
      this.lastFailureTime = Date.now();
      
      // Si on était en HALF_OPEN, on revient en OPEN mais avec un délai de reset plus long
      if (this.serviceState[serviceKey] === 'HALF_OPEN') {
        this.resetAttempts++;
        this.serviceState[serviceKey] = 'OPEN';
        
        // Augmenter progressivement le délai de reset en fonction du nombre de tentatives
        if (this.resetAttempts <= this.config.maxResetAttempts) {
          const backoffFactor = Math.min(Math.pow(2, this.resetAttempts - 1), 10); // limité à 10x
          console.log(`CircuitBreaker: Échec du reset pour ${serviceKey}. Nouvel essai dans ${this.config.resetTimeout * backoffFactor / 1000}s`);
        } else {
          console.error(`CircuitBreaker: Nombre maximum de tentatives atteint pour ${serviceKey}`);
        }
      }
      // Si on atteint le seuil d'échecs, on ouvre le circuit
      else if (this.failureCount >= this.config.failureThreshold) {
        console.log(`CircuitBreaker: Passage en OPEN pour ${serviceKey} (trop d'échecs)`);
        this.serviceState[serviceKey] = 'OPEN';
      }
      
      throw error;
    }
  }

  /**
   * Exécuter une fonction avec un timeout
   */
  private executeWithTimeout<T>(fn: () => Promise<T>, timeout: number): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      // Créer une promesse avec timeout
      const timeoutId = setTimeout(() => {
        reject(new Error('La requête a expiré (timeout)'));
      }, timeout);
      
      // Exécuter la fonction
      fn()
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
   * Réinitialiser manuellement l'état d'un service
   */
  resetService(serviceKey: string): void {
    this.serviceState[serviceKey] = 'CLOSED';
    console.log(`CircuitBreaker: Réinitialisation manuelle du circuit pour ${serviceKey}`);
  }

  /**
   * Obtenir l'état actuel d'un service
   */
  getServiceState(serviceKey: string): CircuitState {
    return this.serviceState[serviceKey] || 'CLOSED';
  }

  /**
   * Vérifier si un service est disponible
   */
  isServiceAvailable(serviceKey: string): boolean {
    return this.serviceState[serviceKey] !== 'OPEN';
  }
}

// Créer et exporter une instance unique pour toute l'application
export const circuitBreakerService = new CircuitBreakerService();
