
import { supabase } from '@/integrations/supabase/client';

export class ModuleDependencyRepository {
  /**
   * Get module dependencies
   */
  async getModuleDependencies(moduleId: string): Promise<any[]> {
    try {
      // Récupérer les dépendances pour le module
      const { data: dependencyData, error: dependencyError } = await supabase
        .from('module_dependencies')
        .select('id, module_id, dependency_id, is_required')
        .eq('module_id', moduleId);
      
      if (dependencyError) throw dependencyError;
      
      if (!dependencyData || dependencyData.length === 0) {
        return [];
      }
      
      // Récupérer les détails des modules de dépendance
      const dependencies: any[] = [];
      
      for (const dep of dependencyData) {
        const { data: moduleData, error: moduleError } = await supabase
          .from('app_modules')
          .select('id, name, code, status')
          .eq('id', dep.dependency_id)
          .single();
          
        if (moduleError) {
          console.error(`Error fetching dependency module ${dep.dependency_id}:`, moduleError);
          continue;
        }
        
        if (moduleData) {
          dependencies.push({
            id: dep.id,
            module_id: dep.module_id,
            dependency_id: dep.dependency_id,
            is_required: dep.is_required,
            dependency: moduleData
          });
        }
      }
      
      return dependencies;
    } catch (error) {
      console.error(`Error fetching dependencies for module ${moduleId}:`, error);
      return [];
    }
  }
}
