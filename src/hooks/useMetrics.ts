
/**
 * Hook pour utiliser le service de métriques dans les composants React
 */
import { useCallback } from 'react';
import { metricsService } from '@/services/monitoring/MetricsService';

export const useMetrics = () => {
  // Wrapper pour incrémenter un compteur
  const incrementCounter = useCallback((name: string, value: number = 1, tags: Record<string, string> = {}) => {
    metricsService.incrementCounter(name, value, tags);
  }, []);
  
  // Wrapper pour définir une jauge
  const setGauge = useCallback((name: string, value: number, tags: Record<string, string> = {}) => {
    metricsService.setGauge(name, value, tags);
  }, []);
  
  // Wrapper pour enregistrer un histogram
  const recordHistogram = useCallback((name: string, value: number, tags: Record<string, string> = {}) => {
    metricsService.recordHistogram(name, value, tags);
  }, []);
  
  // Wrapper pour mesurer le temps d'une opération
  const measureOperation = useCallback(async <T>(
    name: string, 
    operation: () => Promise<T>, 
    tags: Record<string, string> = {}
  ): Promise<T> => {
    metricsService.startTimer(name, tags);
    try {
      const result = await operation();
      metricsService.stopTimer(name, tags);
      return result;
    } catch (error) {
      // Ajouter un tag d'erreur
      metricsService.stopTimer(name, { ...tags, error: 'true' });
      throw error;
    }
  }, []);
  
  // Wrapper pour chronométrer l'exécution d'une fonction
  const withTiming = useCallback(<T extends any[], R>(
    name: string,
    fn: (...args: T) => R,
    tags: Record<string, string> = {}
  ): ((...args: T) => R) => {
    return (...args: T): R => {
      metricsService.startTimer(name, tags);
      try {
        const result = fn(...args);
        
        // Gérer à la fois les valeurs synchrones et les promesses
        if (result instanceof Promise) {
          return result
            .then(value => {
              metricsService.stopTimer(name, tags);
              return value;
            })
            .catch(error => {
              metricsService.stopTimer(name, { ...tags, error: 'true' });
              throw error;
            }) as unknown as R;
        } else {
          metricsService.stopTimer(name, tags);
          return result;
        }
      } catch (error) {
        metricsService.stopTimer(name, { ...tags, error: 'true' });
        throw error;
      }
    };
  }, []);
  
  // Obtenir la valeur actuelle d'une métrique
  const getMetricValue = useCallback((name: string, tags: Record<string, string> = {}) => {
    return metricsService.getMetricValue(name, tags);
  }, []);

  return {
    incrementCounter,
    setGauge,
    recordHistogram,
    measureOperation,
    withTiming,
    getMetricValue
  };
};
