
import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AppModule } from '@/hooks/modules/types';
import { moduleQueries, updateModuleStatusAsync, updateFeatureStatusAsync } from './moduleQueries';
import { initializeModuleApi } from './moduleInitialization';
import { useModulePriority } from './useModulePriority';

/**
 * Core hook for module API integration
 */
export const useModuleApiCore = () => {
  const queryClient = useQueryClient();
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [internalModules, setInternalModules] = useState<AppModule[]>([]);
  const [features, setFeatures] = useState<Record<string, Record<string, boolean>>>({});
  const { sortModulesByPriority } = useModulePriority();
  
  // Fetch modules and features
  const { 
    data: modules = [], 
    isLoading: isModulesLoading, 
    error: modulesError,
    refetch: refreshModules
  } = moduleQueries.useModules();
  
  const {
    data: featuresData = {},
    isLoading: isFeaturesLoading,
    error: featuresError,
    refetch: refreshFeatures
  } = moduleQueries.useFeatures();
  
  // Update a module's status
  const updateModuleStatus = useCallback(async (
    moduleId: string, 
    status: 'active' | 'inactive' | 'degraded' | 'maintenance'
  ) => {
    try {
      await updateModuleStatusAsync(moduleId, status);
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      return true;
    } catch (error) {
      console.error('Error updating module status:', error);
      return false;
    }
  }, [queryClient]);
  
  // Update a feature's status
  const updateFeatureStatus = useCallback(async (
    moduleCode: string, 
    featureCode: string, 
    isEnabled: boolean
  ) => {
    try {
      // Call feature status update
      // This is a simplified implementation
      console.log(`Updating feature ${featureCode} for module ${moduleCode} to ${isEnabled}`);
      
      // Update local state
      setFeatures(prev => ({
        ...prev,
        [moduleCode]: {
          ...prev[moduleCode],
          [featureCode]: isEnabled
        }
      }));
      
      // Invalidate features query
      queryClient.invalidateQueries({ queryKey: ['module-features'] });
      
      return true;
    } catch (error) {
      console.error('Error updating feature status:', error);
      return false;
    }
  }, [queryClient]);
  
  // Initialize module API
  useEffect(() => {
    const init = async () => {
      try {
        await initializeModuleApi(
          isInitialized,
          setIsInitialized,
          setInternalModules,
          setFeatures,
          setLoading,
          refreshModules,
          refreshFeatures
        );
      } catch (error) {
        console.error('Error initializing module API:', error);
        setLoading(false);
      }
    };
    
    init();
  }, [isInitialized, refreshModules, refreshFeatures]);
  
  // Update internal state when modules or features change
  useEffect(() => {
    if (modules && modules.length > 0) {
      setInternalModules(sortModulesByPriority(modules));
    }
  }, [modules, sortModulesByPriority]);
  
  useEffect(() => {
    if (featuresData) {
      setFeatures(featuresData);
    }
  }, [featuresData]);
  
  useEffect(() => {
    if (!isModulesLoading && !isFeaturesLoading) {
      setLoading(false);
    }
  }, [isModulesLoading, isFeaturesLoading]);
  
  return {
    modules: internalModules,
    features,
    loading: loading || isModulesLoading || isFeaturesLoading,
    error: modulesError || featuresError,
    isInitialized,
    updateModuleStatus,
    updateFeatureStatus,
    refreshModules: () => {
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      queryClient.invalidateQueries({ queryKey: ['module-features'] });
      return refreshModules();
    },
    refreshFeatures: () => {
      return refreshFeatures();
    }
  };
};
