
import { supabase } from '@/integrations/supabase/client';

// Define explicit types for module usage stats
interface ModuleUsageStat {
  id: string;
  module_id?: string;
  module_code: string;
  usage_count: number;
  last_used: string;
}

export class ModuleStatsRepository {
  /**
   * Get module usage stats
   */
  async getModuleUsageStats(moduleId: string): Promise<ModuleUsageStat | null> {
    try {
      const { data, error } = await supabase
        .from('module_usage_stats')
        .select('*')
        .eq('module_id', moduleId)
        .single();

      if (error) throw error;
      return data as ModuleUsageStat;
    } catch (error) {
      console.error(`Error fetching usage stats for module ${moduleId}:`, error);
      return null;
    }
  }

  /**
   * Record module usage
   */
  async recordModuleUsage(moduleCode: string): Promise<boolean> {
    try {
      // First check if a record already exists
      const { data: existingRecord, error: queryError } = await supabase
        .from('module_usage_stats')
        .select('id, usage_count')
        .eq('module_code', moduleCode)
        .single();
      
      if (queryError && queryError.code !== 'PGRST116') {
        // PGRST116 is the error code for "no rows returned", which is expected if no record exists
        throw queryError;
      }
      
      if (existingRecord) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('module_usage_stats')
          .update({ 
            usage_count: (existingRecord.usage_count || 0) + 1,
            last_used: new Date().toISOString()
          })
          .eq('id', existingRecord.id);
          
        if (updateError) throw updateError;
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from('module_usage_stats')
          .insert({ 
            module_code: moduleCode,
            usage_count: 1,
            last_used: new Date().toISOString()
          });
          
        if (insertError) throw insertError;
      }
      
      return true;
    } catch (error) {
      console.error(`Error recording usage for module ${moduleCode}:`, error);
      return false;
    }
  }
}
