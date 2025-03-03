
/**
 * Service de métriques pour monitorer les performances de l'application
 * Permet de collecter, agréger et reporter des métriques sur l'utilisation des modules et services
 */

import { eventBus } from '@/core/event-bus/EventBus';

// Types de métriques supportés
export type MetricType = 'counter' | 'gauge' | 'histogram' | 'timer';

// Structure d'une métrique
export interface Metric {
  name: string;
  value: number;
  type: MetricType;
  tags: Record<string, string>;
  timestamp: number;
}

// Configuration du service de métriques
interface MetricsConfig {
  enableConsoleReporting: boolean;
  reportingIntervalMs: number;
  maxMetricsHistory: number;
  enableHistoricalTracking: boolean;
}

export class MetricsService {
  private metrics: Record<string, Metric> = {};
  private metricsHistory: Metric[] = [];
  private timers: Record<string, number> = {};
  private config: MetricsConfig = {
    enableConsoleReporting: process.env.NODE_ENV !== 'production',
    reportingIntervalMs: 60000, // 1 minute
    maxMetricsHistory: 1000,
    enableHistoricalTracking: true
  };
  private reportingInterval: number | null = null;

  constructor() {
    this.initReporting();
  }

  /**
   * Configure le service de métriques
   * @param config Configuration partielle
   */
  configure(config: Partial<MetricsConfig>): void {
    this.config = { ...this.config, ...config };
    
    // Réinitialiser l'intervalle de reporting si nécessaire
    if (this.reportingInterval !== null) {
      window.clearInterval(this.reportingInterval);
      this.initReporting();
    }
  }

  /**
   * Initialise le reporting de métriques
   */
  private initReporting(): void {
    if (typeof window !== 'undefined' && this.config.enableConsoleReporting) {
      this.reportingInterval = window.setInterval(() => {
        this.reportMetrics();
      }, this.config.reportingIntervalMs);
    }
  }

  /**
   * Incrémente un compteur
   * @param name Nom de la métrique
   * @param value Valeur à ajouter (défaut: 1)
   * @param tags Tags associés à la métrique
   */
  incrementCounter(name: string, value: number = 1, tags: Record<string, string> = {}): void {
    const metricKey = this.getMetricKey(name, tags);
    
    if (!this.metrics[metricKey]) {
      this.metrics[metricKey] = {
        name,
        value: 0,
        type: 'counter',
        tags,
        timestamp: Date.now()
      };
    }
    
    this.metrics[metricKey].value += value;
    this.metrics[metricKey].timestamp = Date.now();
    
    this.trackHistory(this.metrics[metricKey]);
  }

  /**
   * Définit la valeur d'une jauge
   * @param name Nom de la métrique
   * @param value Valeur à définir
   * @param tags Tags associés à la métrique
   */
  setGauge(name: string, value: number, tags: Record<string, string> = {}): void {
    const metricKey = this.getMetricKey(name, tags);
    
    this.metrics[metricKey] = {
      name,
      value,
      type: 'gauge',
      tags,
      timestamp: Date.now()
    };
    
    this.trackHistory(this.metrics[metricKey]);
  }

  /**
   * Enregistre une valeur dans un histogramme
   * @param name Nom de la métrique
   * @param value Valeur à enregistrer
   * @param tags Tags associés à la métrique
   */
  recordHistogram(name: string, value: number, tags: Record<string, string> = {}): void {
    // Pour simplifier, on utilise une approche basique. Une implémentation complète
    // nécessiterait de stocker les distributions, percentiles, etc.
    const metricKey = this.getMetricKey(name, tags);
    
    if (!this.metrics[metricKey]) {
      this.metrics[metricKey] = {
        name,
        value: 0,
        type: 'histogram',
        tags,
        timestamp: Date.now()
      };
    }
    
    // Ici, on stocke simplement la dernière valeur
    this.metrics[metricKey].value = value;
    this.metrics[metricKey].timestamp = Date.now();
    
    this.trackHistory(this.metrics[metricKey]);
    
    // Émettre un événement avec la nouvelle valeur
    eventBus.publish('metrics:histogram_recorded', {
      name,
      value,
      tags,
      timestamp: Date.now()
    });
  }

  /**
   * Démarre un timer
   * @param name Nom du timer
   * @param tags Tags associés
   */
  startTimer(name: string, tags: Record<string, string> = {}): void {
    const timerKey = this.getMetricKey(name, tags);
    this.timers[timerKey] = performance.now();
  }

  /**
   * Arrête un timer et enregistre la durée
   * @param name Nom du timer
   * @param tags Tags associés
   * @returns Durée mesurée en ms, ou -1 si le timer n'existait pas
   */
  stopTimer(name: string, tags: Record<string, string> = {}): number {
    const timerKey = this.getMetricKey(name, tags);
    const startTime = this.timers[timerKey];
    
    if (startTime === undefined) {
      console.warn(`Timer "${name}" n'a pas été démarré`);
      return -1;
    }
    
    const duration = performance.now() - startTime;
    delete this.timers[timerKey];
    
    // Enregistrer la durée comme une métrique
    const metricKey = this.getMetricKey(name, tags);
    
    this.metrics[metricKey] = {
      name,
      value: duration,
      type: 'timer',
      tags,
      timestamp: Date.now()
    };
    
    this.trackHistory(this.metrics[metricKey]);
    
    // Émettre un événement avec la durée
    eventBus.publish('metrics:timer_stopped', {
      name,
      duration,
      tags,
      timestamp: Date.now()
    });
    
    return duration;
  }

  /**
   * Génère une clé unique pour une métrique
   * @param name Nom de la métrique
   * @param tags Tags associés
   * @returns Clé unique
   */
  private getMetricKey(name: string, tags: Record<string, string>): string {
    const tagString = Object.entries(tags)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, value]) => `${key}:${value}`)
      .join(',');
    
    return `${name}${tagString ? `;${tagString}` : ''}`;
  }

  /**
   * Suit l'historique des métriques
   * @param metric Métrique à suivre
   */
  private trackHistory(metric: Metric): void {
    if (!this.config.enableHistoricalTracking) return;
    
    this.metricsHistory.push({ ...metric });
    
    // Limiter la taille de l'historique
    if (this.metricsHistory.length > this.config.maxMetricsHistory) {
      this.metricsHistory.shift();
    }
  }

  /**
   * Rapporte les métriques courantes
   */
  private reportMetrics(): void {
    if (!this.config.enableConsoleReporting) return;
    
    const metrics = Object.values(this.metrics);
    
    if (metrics.length === 0) return;
    
    console.group('Rapport de métriques');
    console.table(metrics.map(m => ({
      Name: m.name,
      Value: m.value,
      Type: m.type,
      Tags: JSON.stringify(m.tags),
      LastUpdated: new Date(m.timestamp).toISOString()
    })));
    console.groupEnd();
    
    // Émettre un événement avec toutes les métriques
    eventBus.publish('metrics:report', {
      metrics,
      timestamp: Date.now()
    });
  }

  /**
   * Récupère la valeur actuelle d'une métrique
   * @param name Nom de la métrique
   * @param tags Tags associés
   * @returns Valeur de la métrique ou null si non trouvée
   */
  getMetricValue(name: string, tags: Record<string, string> = {}): number | null {
    const metricKey = this.getMetricKey(name, tags);
    const metric = this.metrics[metricKey];
    
    return metric ? metric.value : null;
  }

  /**
   * Récupère l'historique pour une métrique
   * @param name Nom de la métrique
   * @param tags Tags associés (optionnel)
   * @returns Liste des entrées d'historique
   */
  getMetricHistory(name: string, tags?: Record<string, string>): Metric[] {
    return this.metricsHistory.filter(m => {
      // Filtrer par nom
      if (m.name !== name) return false;
      
      // Si des tags sont spécifiés, vérifier qu'ils correspondent
      if (tags) {
        return Object.entries(tags).every(([key, value]) => m.tags[key] === value);
      }
      
      return true;
    });
  }

  /**
   * Efface toutes les métriques
   */
  clearAllMetrics(): void {
    this.metrics = {};
    this.metricsHistory = [];
    this.timers = {};
  }
}

// Exporter une instance unique pour toute l'application
export const metricsService = new MetricsService();
