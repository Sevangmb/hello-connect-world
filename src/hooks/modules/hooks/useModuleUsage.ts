
import { useEffect, useCallback } from 'react';
import { ModuleServiceImpl } from '@/services/modules/services/ModuleServiceImpl';
import { getModuleRepository } from '@/services/modules/repositories';

/**
 * Hook to record module usage
 */
export const useModuleUsage = (moduleCode: string) => {
  const recordModuleUsage = useCallback(async () => {
    try {
      const repository = getModuleRepository();
      const moduleService = new ModuleServiceImpl(repository);
      await moduleService.recordModuleUsage(moduleCode);
    } catch (error) {
      console.error(`Error recording usage for module ${moduleCode}:`, error);
    }
  }, [moduleCode]);

  // Record usage when the hook is mounted
  useEffect(() => {
    recordModuleUsage();
  }, [recordModuleUsage]);

  return { recordModuleUsage };
};
