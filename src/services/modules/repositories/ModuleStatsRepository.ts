
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
        .maybeSingle();

      if (error) throw error;
      return data || null;
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
        .maybeSingle();
      
      if (queryError) throw queryError;
      
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
