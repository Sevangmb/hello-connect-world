
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_MODULE_CODE } from "../constants";

/**
 * Fetches feature flags for modules
 */
export async function fetchFeatures(): Promise<Record<string, Record<string, boolean>>> {
  try {
    const { data, error } = await supabase
      .from('module_features')
      .select('*');

    if (error) {
      console.error("Error fetching features:", error);
      throw error;
    }

    // Organize features by module
    const featuresByModule: Record<string, Record<string, boolean>> = {};
    
    (data || []).forEach(feature => {
      // Make sure Admin features are always enabled
      if (feature.module_code === ADMIN_MODULE_CODE && !feature.is_enabled) {
        console.warn("Admin feature found inactive, automatic repair...");
        feature.is_enabled = true;
        
        // Update in database
        supabase
          .from('module_features')
          .update({ is_enabled: true, updated_at: new Date().toISOString() })
          .eq('id', feature.id);
      }
      
      if (!featuresByModule[feature.module_code]) {
        featuresByModule[feature.module_code] = {};
      }
      featuresByModule[feature.module_code][feature.feature_code] = feature.is_enabled;
    });

    return featuresByModule;
  } catch (error) {
    console.error("Exception during features fetch:", error);
    return {};
  }
}
