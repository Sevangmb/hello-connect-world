
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useModules = () => {
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState([]);
  const [features, setFeatures] = useState({});
  const [error, setError] = useState(null);

  // Cache en mémoire pour les vérifications répétées
  const moduleStatusCache = {};
  
  // Récupérer tous les modules
  const fetchModules = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('app_modules')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      // Mettre à jour le cache pour chaque module
      data.forEach(module => {
        moduleStatusCache[module.code] = {
          status: module.status,
          timestamp: Date.now()
        };
      });
      
      setModules(data);
      return data;
    } catch (err) {
      console.error('Erreur lors du chargement des modules:', err);
      setError(err.message);
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
      const featuresData = {};
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

  // Vérifier si un module est actif
  const isModuleActive = useCallback(async (moduleCode) => {
    // Administrateur toujours actif
    if (moduleCode === 'admin' || moduleCode.startsWith('admin_')) {
      return true;
    }
    
    // Vérifier le cache (validité: 30 secondes)
    const cached = moduleStatusCache[moduleCode];
    if (cached && (Date.now() - cached.timestamp < 30000)) {
      return cached.status === 'active';
    }
    
    try {
      // Sinon, faire une requête à la base de données
      const { data, error } = await supabase
        .from('app_modules')
        .select('status')
        .eq('code', moduleCode)
        .single();
      
      if (error) {
        console.error(`Erreur lors de la vérification du module ${moduleCode}:`, error);
        return false;
      }
      
      // Mettre à jour le cache
      moduleStatusCache[moduleCode] = {
        status: data.status,
        timestamp: Date.now()
      };
      
      return data.status === 'active';
    } catch (err) {
      console.error(`Exception lors de la vérification du module ${moduleCode}:`, err);
      return false;
    }
  }, []);

  // Mettre à jour le statut d'un module
  const updateModuleStatus = useCallback(async (moduleId, status) => {
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

  // Initialiser les données au montage
  useEffect(() => {
    const init = async () => {
      await fetchModules();
      await fetchFeatures();
    };
    
    init();
    
    // Configurer un intervalle pour rafraîchir périodiquement les données
    const refreshInterval = setInterval(() => {
      fetchModules();
    }, 60000); // Toutes les 60 secondes
    
    return () => clearInterval(refreshInterval);
  }, [fetchModules, fetchFeatures]);

  return {
    loading,
    error,
    modules,
    isModuleActive,
    updateModuleStatus,
    fetchModules
  };
};

export * from './modules';
