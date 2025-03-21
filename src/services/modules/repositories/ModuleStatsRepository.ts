
import { supabase } from '@/integrations/supabase/client';

// Define explicit types for module usage stats
interface ModuleUsageStat {
  id: string;
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
      // Query by module_code instead of module_id since that's the column that exists
      // Use explicit type casting to avoid deep type inference
      const { data, error } = await supabase
        .from('module_usage_stats')
        .select('id, module_code, usage_count, last_used')
        .eq('module_code', moduleId)
        .maybeSingle();

      if (error) throw error;
      return data as ModuleUsageStat | null;
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
        .maybeSingle();
      
      if (queryError) {
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
      console.error(`Error in fallback recording for module ${moduleCode}:`, error);
      return false;
    }
  }
}
