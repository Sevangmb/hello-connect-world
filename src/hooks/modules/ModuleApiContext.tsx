
import React, { createContext, useContext, ReactNode } from 'react';
import { useModuleApiCore } from './hooks/useModuleApiCore';
import { ModuleStatus, AppModule } from './types';

// Interface pour le contexte
interface ModuleApiContextType {
  // Fonctions asynchrones pour les vérifications précises
  isModuleActive: (moduleCode: string) => Promise<boolean>;
  isModuleDegraded: (moduleCode: string) => Promise<boolean>;
  isFeatureEnabled: (moduleCode: string, featureCode: string) => Promise<boolean>;
  
  // Fonctions synchrones pour les rendus React (utilisent le cache seulement)
  getModuleActiveStatus: (moduleCode: string) => boolean;
  getModuleDegradedStatus: (moduleCode: string) => boolean;
  getFeatureEnabledStatus: (moduleCode: string, featureCode: string) => boolean;
  
  // Fonctions de rafraîchissement
  refreshModules: (force?: boolean) => Promise<AppModule[]>;
  refreshFeatures: (force?: boolean) => Promise<Record<string, Record<string, boolean>>>;
  
  // Fonctions de mise à jour
  updateModuleStatus: (moduleId: string, status: ModuleStatus) => Promise<boolean>;
  updateFeatureStatus: (moduleCode: string, featureCode: string, isEnabled: boolean) => Promise<boolean>;
  
  // État
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
  modules: AppModule[];
}

// Créer le contexte avec des valeurs par défaut
const ModuleApiContext = createContext<ModuleApiContextType>({
  isModuleActive: async () => false,
  isModuleDegraded: async () => false,
  isFeatureEnabled: async () => false,
  getModuleActiveStatus: () => false,
  getModuleDegradedStatus: () => false,
  getFeatureEnabledStatus: () => false,
  refreshModules: async () => [],
  refreshFeatures: async () => ({}),
  updateModuleStatus: async () => false,
  updateFeatureStatus: async () => false,
  loading: true,
  error: null,
  isInitialized: false,
  modules: []
});

// Props pour le provider
interface ModuleApiProviderProps {
  children: ReactNode;
}

// Provider pour le contexte
export const ModuleApiProvider = ({ children }: ModuleApiProviderProps) => {
  const moduleApiCore = useModuleApiCore();
  
  // Complete the context with missing methods
  const moduleApi: ModuleApiContextType = {
    ...moduleApiCore,
    isModuleActive: async (moduleCode: string) => {
      const module = moduleApiCore.modules.find(m => m.code === moduleCode);
      return module?.status === 'active';
    },
    isModuleDegraded: async (moduleCode: string) => {
      const module = moduleApiCore.modules.find(m => m.code === moduleCode);
      return module?.status === 'degraded';
    },
    isFeatureEnabled: async (moduleCode: string, featureCode: string) => {
      return moduleApiCore.features?.[moduleCode]?.[featureCode] || false;
    },
    getModuleActiveStatus: (moduleCode: string) => {
      const module = moduleApiCore.modules.find(m => m.code === moduleCode);
      return module?.status === 'active';
    },
    getModuleDegradedStatus: (moduleCode: string) => {
      const module = moduleApiCore.modules.find(m => m.code === moduleCode);
      return module?.status === 'degraded';
    },
    getFeatureEnabledStatus: (moduleCode: string, featureCode: string) => {
      return moduleApiCore.features?.[moduleCode]?.[featureCode] || false;
    },
    refreshModules: async (force?: boolean) => {
      const result = await moduleApiCore.refreshModules();
      return result.data || [];
    },
    refreshFeatures: async (force?: boolean) => {
      const result = await moduleApiCore.refreshFeatures();
      return result.data || {};
    },
    updateModuleStatus: moduleApiCore.updateModuleStatus,
    updateFeatureStatus: moduleApiCore.updateFeatureStatus,
    loading: moduleApiCore.loading,
    error: moduleApiCore.error ? moduleApiCore.error.toString() : null,
    isInitialized: moduleApiCore.isInitialized,
    modules: moduleApiCore.modules
  };
  
  return (
    <ModuleApiContext.Provider value={moduleApi}>
      {children}
    </ModuleApiContext.Provider>
  );
};

// Hook pour utiliser le contexte
export const useModuleApiContext = () => {
  const context = useContext(ModuleApiContext);
  
  if (context === undefined) {
    throw new Error('useModuleApiContext doit être utilisé à l\'intérieur d\'un ModuleApiProvider');
  }
  
  return context;
};
