
import React, { createContext, useContext, ReactNode } from 'react';
import { useModuleApi } from './useModuleApi';
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
  isInitialized: false
});

// Props pour le provider
interface ModuleApiProviderProps {
  children: ReactNode;
}

// Provider pour le contexte
export const ModuleApiProvider = ({ children }: ModuleApiProviderProps) => {
  const moduleApi = useModuleApi();
  
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
    throw new Error('useModuleApiContext doit être utilisé à l'intérieur d'un ModuleApiProvider');
  }
  
  return context;
};
