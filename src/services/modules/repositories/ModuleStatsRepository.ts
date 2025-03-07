
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
      // Use more explicit query with proper type handling
      const { data, error } = await supabase
        .from('module_usage_stats')
        .select('*')
        .eq('module_id', moduleId)
        .limit(1)
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
      // Utiliser la fonction RPC de Supabase pour incrémenter l'utilisation du module
      const { error } = await supabase
        .rpc('increment_module_usage', { module_code: moduleCode });
      
      if (error) {
        console.error(`Error recording usage for module ${moduleCode} via RPC:`, error);
        
        // Fallback au mécanisme manuel en cas d'échec de la fonction RPC
        return await this.recordModuleUsageFallback(moduleCode);
      }
      
      return true;
    } catch (error) {
      console.error(`Error recording usage for module ${moduleCode}:`, error);
      
      // En cas d'exception, tenter le mécanisme fallback
      return await this.recordModuleUsageFallback(moduleCode);
    }
  }
  
  /**
   * Mécanisme fallback pour enregistrer l'utilisation d'un module
   * si la RPC ne fonctionne pas
   */
  private async recordModuleUsageFallback(moduleCode: string): Promise<boolean> {
    try {
      // First check if a record already exists
      const { data: existingRecord, error: queryError } = await supabase
        .from('module_usage_stats')
        .select('id, usage_count')
        .eq('module_code', moduleCode)
        .limit(1);
      
      if (queryError) {
        throw queryError;
      }
      
      if (existingRecord && existingRecord.length > 0) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('module_usage_stats')
          .update({ 
            usage_count: (existingRecord[0].usage_count || 0) + 1,
            last_used: new Date().toISOString()
          })
          .eq('id', existingRecord[0].id);
          
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
      console.error(`Error in fallback recording for module ${moduleCode}:`, error);
      return false;
    }
  }
}
