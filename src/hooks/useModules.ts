import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AppModule, ModuleStatus } from './modules/types';

// Types
interface ModuleCache {
  [moduleCode: string]: { 
    status: ModuleStatus;
    timestamp: number;
  };
}

export const useModules = () => {
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState<AppModule[]>([]);
  const [features, setFeatures] = useState<Record<string, Record<string, boolean>>>({});
  const [error, setError] = useState<any>(null);
  const [dependencies, setDependencies] = useState<any[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');

  // Cache en mémoire pour les vérifications répétées
  const moduleStatusCache: ModuleCache = {};
  
  // Récupérer tous les modules
  const fetchModules = useCallback(async () => {
    try {
      setLoading(true);
      setConnectionStatus('checking');
      
      const { data, error } = await supabase
        .from('app_modules')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      setConnectionStatus('connected');
      
      // Mettre à jour le cache pour chaque module
      const typedData = data.map(module => ({
        ...module,
        status: module.status as ModuleStatus
      }));
      
      typedData.forEach(module => {
        moduleStatusCache[module.code] = {
          status: module.status,
          timestamp: Date.now()
        };
      });
      
      setModules(typedData);
      return typedData;
    } catch (err) {
      console.error('Erreur lors du chargement des modules:', err);
      setError(err.message);
      setConnectionStatus('disconnected');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Récupérer toutes les fonctionnalités
  const fetchFeatures = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('module_features')
        .select('*');
      
      if (error) throw error;
      
      // Organiser les fonctionnalités par module
      const featuresData: Record<string, Record<string, boolean>> = {};
      data.forEach(feature => {
        if (!featuresData[feature.module_code]) {
          featuresData[feature.module_code] = {};
        }
        featuresData[feature.module_code][feature.feature_code] = feature.is_enabled;
      });
      
      setFeatures(featuresData);
      return featuresData;
    } catch (err) {
      console.error('Erreur lors du chargement des fonctionnalités:', err);
      setError(err.message);
      return {};
    }
  }, []);

  // Récupérer les dépendances
  const fetchDependencies = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('module_dependencies')
        .select(`
          module_id,
          module_code,
          module_name,
          module_status,
          dependency_id,
          dependency_code,
          dependency_name,
          dependency_status,
          is_required
        `);
      
      if (error) throw error;
      
      setDependencies(data);
      return data;
    } catch (err) {
      console.error('Erreur lors du chargement des dépendances:', err);
      setError(err.message);
      return [];
    }
  }, []);

  // Vérifier si un module est actif
  const isModuleActive = useCallback((moduleCode: string): boolean => {
    // Administrateur toujours actif
    if (moduleCode === 'admin' || moduleCode.startsWith('admin_')) {
      return true;
    }
    
    // Vérifier le cache (validité: 30 secondes)
    const cached = moduleStatusCache[moduleCode];
    if (cached && (Date.now() - cached.timestamp < 30000)) {
      return cached.status === 'active';
    }
    
    // Sinon, vérifier dans la liste des modules
    const module = modules.find(m => m.code === moduleCode);
    if (module) {
      // Mettre à jour le cache
      moduleStatusCache[moduleCode] = {
        status: module.status,
        timestamp: Date.now()
      };
      return module.status === 'active';
    }
    
    return false;
  }, [modules]);

  // Mettre à jour le statut d'un module
  const updateModuleStatus = useCallback(async (moduleId: string, status: ModuleStatus) => {
    try {
      const { error } = await supabase
        .from('app_modules')
        .update({ 
          status,
          updated_at: new Date().toISOString() 
        })
        .eq('id', moduleId);
      
      if (error) throw error;
      
      // Rafraîchir les modules après la mise à jour
      await fetchModules();
      return true;
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut du module:', err);
      setError(err.message);
      return false;
    }
  }, [fetchModules]);

  // Mettre à jour le statut d'une fonctionnalité
  const updateFeatureStatus = useCallback(async (moduleCode: string, featureCode: string, isEnabled: boolean) => {
    try {
      const { error } = await supabase
        .from('module_features')
        .update({ 
          is_enabled: isEnabled,
          updated_at: new Date().toISOString() 
        })
        .eq('module_code', moduleCode)
        .eq('feature_code', featureCode);
      
      if (error) throw error;
      
      // Rafraîchir les fonctionnalités après la mise à jour
      await fetchFeatures();
      return true;
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la fonctionnalité:', err);
      setError(err.message);
      return false;
    }
  }, [fetchFeatures]);

  // Alias pour refreshModules (prévisibilité de l'API)
  const refreshModules = fetchModules;

  // Initialiser les données au montage
  useEffect(() => {
    const init = async () => {
      await fetchModules();
      await fetchFeatures();
      await fetchDependencies();
    };
    
    init();
    
    // Configurer un intervalle pour rafraîchir périodiquement les données
    const refreshInterval = setInterval(() => {
      fetchModules();
    }, 60000); // Toutes les 60 secondes
    
    return () => clearInterval(refreshInterval);
  }, [fetchModules, fetchFeatures, fetchDependencies]);

  return {
    loading,
    error,
    modules,
    dependencies,
    features,
    isModuleActive,
    updateModuleStatus,
    updateFeatureStatus,
    fetchModules,
    refreshModules,
    connectionStatus
  };
};
