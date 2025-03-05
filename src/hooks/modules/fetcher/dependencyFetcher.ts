
import { ModuleDependency } from "../types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches module dependencies
 */
export async function fetchDependencies(): Promise<ModuleDependency[]> {
  try {
    const { data, error } = await supabase
      .from('module_dependencies_view')
      .select('*');

    if (error) {
      console.error("Error fetching dependencies:", error);
      throw error;
    }

    // Map the returned data to match the ModuleDependency interface
    return (data || []).map(item => ({
      id: item.module_id + '_' + item.dependency_id, // Creating a synthetic id
      module_id: item.module_id,
      module_code: item.module_code,
      module_name: item.module_name,
      module_status: item.module_status,
      dependency_id: item.dependency_id,
      dependency_code: item.dependency_code,
      dependency_name: item.dependency_name,
      dependency_status: item.dependency_status,
      depends_on: item.dependency_code || "", // We use dependency_code as depends_on
      is_required: item.is_required,
      created_at: item.created_at || new Date().toISOString(), // Add default if missing
      updated_at: item.updated_at || new Date().toISOString()  // Add default if missing
    }));
  } catch (error) {
    console.error("Exception during dependency fetch:", error);
    return [];
  }
}
