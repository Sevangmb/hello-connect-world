
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

export const useModuleUsage = (moduleCode: string) => {
  const [usageCount, setUsageCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();

  // Fetch usage data for the module
  const fetchUsageData = useCallback(async () => {
    if (!moduleCode) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('module_usage_stats')
        .select('usage_count')
        .eq('module_code', moduleCode)
        .single();
      
      if (error) {
        console.error(`Error fetching usage stats for module ${moduleCode}:`, error);
        setUsageCount(0);
      } else {
        setUsageCount(data?.usage_count || 0);
      }
    } catch (err) {
      console.error(`Exception fetching usage stats for module ${moduleCode}:`, err);
      setUsageCount(0);
    } finally {
      setLoading(false);
    }
  }, [moduleCode]);

  // Record module usage via RPC
  const trackUsage = async () => {
    if (!moduleCode) return;
    
    try {
      const { error } = await supabase.rpc('increment_module_usage', {
        module_code: moduleCode
      });
      
      if (error) {
        console.error(`Error incrementing usage for module ${moduleCode}:`, error);
      } else {
        // Increment the local count and invalidate the query
        setUsageCount(prev => prev + 1);
        queryClient.invalidateQueries({ queryKey: ['moduleUsage', moduleCode] });
      }
    } catch (err) {
      console.error(`Exception incrementing usage for module ${moduleCode}:`, err);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchUsageData();
  }, [fetchUsageData]);

  return {
    usageCount,
    loading,
    trackUsage,
    refreshUsageData: fetchUsageData
  };
};
