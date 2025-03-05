
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { moduleRepository } from '@/services/modules/repositories';

export const useModuleUsage = (moduleCode: string) => {
  const recordModuleUsage = useCallback(async () => {
    try {
      // Get the module ID from the code
      const module = await moduleRepository.getModuleByCode(moduleCode);
      if (!module) {
        console.warn(`Module '${moduleCode}' not found, cannot record usage`);
        return;
      }

      // Get the current user ID if authenticated
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;

      // Insert the usage record
      await supabase
        .from('module_usage')
        .insert({
          module_id: module.id,
          user_id: userId || null,
          timestamp: new Date().toISOString()
        });

      console.log(`Recorded usage for module '${moduleCode}'`);
    } catch (error) {
      console.error(`Error recording module usage for '${moduleCode}':`, error);
    }
  }, [moduleCode]);

  return {
    recordModuleUsage
  };
};
