import { useEffect } from 'react';
import { appModules } from './definitions/AppModules';
import { useModuleRegistry } from './useModuleRegistry';
import { ModuleServiceImpl } from '@/services/modules/services/ModuleServiceImpl';
import { ModuleStatus } from './types';

export const ModuleInitializer = () => {
  const { initializeModules } = useModuleRegistry();

  useEffect(() => {
    const loadModules = async () => {
      await initializeModules();
    };

    loadModules();
  }, [initializeModules]);

  return null;
};
