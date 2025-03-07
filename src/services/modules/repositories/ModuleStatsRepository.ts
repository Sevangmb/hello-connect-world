
import { supabase } from '@/integrations/supabase/client';

export class ModuleStatsRepository {
  /**
   * Get module usage stats
   */
  async getModuleUsageStats(moduleId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('module_usage_stats')
        .select('*')
        .eq('module_id', moduleId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching usage stats for module ${moduleId}:`, error);
      return null;
    }
  }
}
