
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useModuleCore = (moduleCode: string) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [dependencies, setDependencies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchModuleStatus = async () => {
      try {
        setIsLoading(true);
        
        // Vérifier si le module est actif
        const { data, error } = await supabase
          .from('app_modules')
          .select('status')
          .eq('code', moduleCode)
          .single();
          
        if (error) throw error;
        
        setIsActive(data.status === 'active');
        
        // Récupérer les dépendances du module
        const { data: depsData, error: depsError } = await supabase
          .from('module_dependencies')
          .select(`
            id,
            module_id,
            dependency_id,
            is_required,
            created_at,
            module:app_modules!module_dependencies_module_id_fkey(
              id,
              code,
              name,
              status
            ),
            dependency:app_modules!module_dependencies_dependency_id_fkey(
              id,
              code,
              name,
              status
            )
          `)
          .eq('module.code', moduleCode);
          
        if (depsError) throw depsError;
        
        // Structurer les données des dépendances
        const formattedDeps = depsData ? depsData.map((dep: any) => ({
          id: dep.id,
          module_id: dep.module_id,
          module_code: dep.module?.code,
          module_name: dep.module?.name,
          module_status: dep.module?.status,
          dependency_id: dep.dependency_id,
          dependency_code: dep.dependency?.code,
          dependency_name: dep.dependency?.name,
          dependency_status: dep.dependency?.status,
          is_required: dep.is_required
        })) : [];
        
        setDependencies(formattedDeps);
      } catch (err: any) {
        console.error('Error in useModuleCore:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchModuleStatus();
  }, [moduleCode]);
  
  return {
    isActive,
    dependencies,
    isLoading,
    error
  };
};
