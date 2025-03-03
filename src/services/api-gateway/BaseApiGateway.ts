
/**
 * Classe de base pour les API Gateways
 * Définit une structure commune et des fonctionnalités partagées
 */
import { eventBus } from '@/core/event-bus/EventBus';
import { API_EVENTS } from '@/core/event-bus/events';

export abstract class BaseApiGateway {
  protected serviceName: string;
  protected debug: boolean;
  
  constructor(serviceName: string) {
    this.serviceName = serviceName;
    this.debug = process.env.NODE_ENV !== 'production';
  }
  
  /**
   * Exécute une opération avec journalisation et gestion des erreurs
   * @param operation Nom de l'opération
   * @param params Paramètres de l'opération
   * @param executor Fonction d'exécution
   * @returns Résultat de l'opération
   */
  protected async executeOperation<T, P = any>(
    operation: string,
    params: P,
    executor: () => Promise<T>
  ): Promise<T> {
    const requestId = this.generateRequestId();
    const startTime = performance.now();
    
    try {
      // Publier un événement de début de requête
      eventBus.publish(API_EVENTS.REQUEST_STARTED, {
        service: this.serviceName,
        operation,
        timestamp: Date.now(),
        requestId,
        parameters: params
      });
      
      // Exécuter l'opération
      const result = await executor();
      
      // Calculer la durée
      const duration = performance.now() - startTime;
      
      // Publier un événement de succès
      eventBus.publish(API_EVENTS.REQUEST_SUCCEEDED, {
        service: this.serviceName,
        operation,
        timestamp: Date.now(),
        requestId,
        duration,
        status: 200,
        success: true
      });
      
      return result;
    } catch (error) {
      // Calculer la durée
      const duration = performance.now() - startTime;
      
      // Publier un événement d'échec
      eventBus.publish(API_EVENTS.REQUEST_FAILED, {
        service: this.serviceName,
        operation,
        timestamp: Date.now(),
        requestId,
        duration,
        status: error instanceof Error ? 500 : 400,
        success: false,
        error: error instanceof Error ? error.message : String(error)
      });
      
      // Relancer l'erreur
      throw error;
    }
  }
  
  /**
   * Exécute une opération synchrone avec journalisation et gestion des erreurs
   * @param operation Nom de l'opération
   * @param executor Fonction d'exécution
   * @returns Résultat de l'opération
   */
  protected executeSync<T>(operation: string, executor: () => T): T {
    const startTime = performance.now();
    
    try {
      // Exécuter l'opération
      const result = executor();
      
      // Calculer la durée
      const duration = performance.now() - startTime;
      
      // Publier des métriques
      eventBus.publish(API_EVENTS.METRICS, {
        service: this.serviceName,
        operation,
        duration,
        timestamp: Date.now(),
        success: true
      });
      
      return result;
    } catch (error) {
      // Calculer la durée
      const duration = performance.now() - startTime;
      
      // Publier un événement d'erreur
      eventBus.publish(API_EVENTS.ERROR, {
        service: this.serviceName,
        operation,
        error: error instanceof Error ? error.message : String(error),
        timestamp: Date.now()
      });
      
      // Publier des métriques
      eventBus.publish(API_EVENTS.METRICS, {
        service: this.serviceName,
        operation,
        duration,
        timestamp: Date.now(),
        success: false
      });
      
      // Relancer l'erreur
      throw error;
    }
  }
  
  /**
   * Génère un identifiant de requête unique
   * @returns Identifiant de requête
   */
  private generateRequestId(): string {
    return `${this.serviceName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Active ou désactive le mode debug
   * @param enabled Statut du mode debug
   */
  public setDebug(enabled: boolean): void {
    this.debug = enabled;
  }
}
