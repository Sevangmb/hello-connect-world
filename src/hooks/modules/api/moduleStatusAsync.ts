
import { ModuleStatus } from "../types";
import { supabase } from '@/integrations/supabase/client';

export async function getModuleStatus(moduleCode: string): Promise<ModuleStatus | null> {
  try {
    const { data, error } = await supabase
      .from('app_modules')
      .select('status')
      .eq('code', moduleCode)
      .single();
    
    if (error || !data) {
      console.error(`Error fetching status for module ${moduleCode}:`, error);
      return null;
    }
    
    return data.status as ModuleStatus;
  } catch (e) {
    console.error(`Exception when fetching module status for ${moduleCode}:`, e);
    return null;
  }
}
