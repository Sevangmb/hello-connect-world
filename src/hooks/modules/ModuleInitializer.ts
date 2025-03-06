
import { useEffect } from 'react';
import { appModules } from './definitions/AppModules';
import { useModuleRegistry } from './useModuleRegistry';

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
