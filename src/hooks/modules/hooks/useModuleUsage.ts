
import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useModuleUsage = (moduleCode: string) => {
  const [usageCount, setUsageCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  const fetchUsageData = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('module_usage_stats')
        .select('usage_count')
        .eq('module_code', moduleCode)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No usage data found
          setUsageCount(0);
        } else {
          console.error(`Error fetching usage data for module ${moduleCode}:`, error);
        }
      } else if (data) {
        setUsageCount(data.usage_count);
      }
    } catch (err) {
      console.error(`Exception when fetching usage data for module ${moduleCode}:`, err);
    } finally {
      setLoading(false);
    }
  }, [moduleCode]);

  useEffect(() => {
    fetchUsageData();
  }, [fetchUsageData]);

  const trackUsage = useCallback(async () => {
    try {
      const { error } = await supabase.rpc('increment_module_usage', {
        p_module_code: moduleCode
      });

      if (error) {
        console.error(`Error tracking usage for module ${moduleCode}:`, error);
      } else {
        setUsageCount(prev => prev + 1);
        // Invalidate queries related to this module
        queryClient.invalidateQueries(['modules', moduleCode]);
      }
    } catch (err) {
      console.error(`Exception when tracking usage for module ${moduleCode}:`, err);
    }
  }, [moduleCode, queryClient]);

  return {
    usageCount,
    loading,
    trackUsage,
    refreshUsageData: fetchUsageData
  };
};
