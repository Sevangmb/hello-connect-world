
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ModuleStatus } from '@/hooks/modules/types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Update a module's status asynchronously (direct function, not a hook)
 */
export const updateModuleStatusAsync = async (
  moduleId: string, 
  status: ModuleStatus
): Promise<any> => {
  const { data, error } = await supabase
    .from('app_modules')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', moduleId)
    .select();
  
  if (error) {
    console.error('Error updating module status:', error);
    throw error;
  }
  
  return data;
};

/**
 * Mutation hook for updating a module's status
 */
export const useUpdateModuleStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ moduleId, status }: { moduleId: string; status: ModuleStatus }) => 
      updateModuleStatusAsync(moduleId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules'] });
    }
  });
};

/**
 * Update a feature's status asynchronously (direct function, not a hook)
 */
export const updateFeatureStatusAsync = async (
  moduleCode: string,
  featureCode: string,
  isEnabled: boolean
): Promise<any> => {
  const { data, error } = await supabase
    .from('module_features')
    .update({ 
      is_enabled: isEnabled, 
      updated_at: new Date().toISOString() 
    })
    .eq('module_code', moduleCode)
    .eq('feature_code', featureCode)
    .select();
  
  if (error) {
    console.error('Error updating feature status:', error);
    throw error;
  }
  
  return data;
};

/**
 * Mutation hook for updating a feature's status
 */
export const useUpdateFeatureStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      moduleCode, 
      featureCode, 
      isEnabled 
    }: { 
      moduleCode: string; 
      featureCode: string; 
      isEnabled: boolean 
    }) => updateFeatureStatusAsync(moduleCode, featureCode, isEnabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['module-features'] });
    }
  });
};
