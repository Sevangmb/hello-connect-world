
import { useQuery } from '@tanstack/react-query';
import { AppModule, ModuleStatus } from '@/hooks/modules/types';
import { fetchAllModules, fetchAllFeatures } from '../api/moduleSync';

// Update module status in Supabase
export const updateModuleStatusAsync = async (moduleId: string, status: ModuleStatus): Promise<boolean> => {
  // Implementation
  console.log(`Updating module ${moduleId} status to ${status}`);
  return true;
};

// Update feature status in Supabase
export const updateFeatureStatusAsync = async (
  moduleCode: string, 
  featureCode: string, 
  isEnabled: boolean
): Promise<boolean> => {
  // Implementation
  console.log(`Updating feature ${moduleCode}.${featureCode} to ${isEnabled}`);
  return true;
};

// Module queries
export const moduleQueries = {
  // Get all modules
  useModules: () => useQuery({
    queryKey: ['modules'],
    queryFn: async () => {
      try {
        const modules = await fetchAllModules();
        return modules;
      } catch (error) {
        console.error('Error fetching modules:', error);
        return [];
      }
    }
  }),
  
  // Get all features
  useFeatures: () => useQuery({
    queryKey: ['module-features'],
    queryFn: async () => {
      try {
        const features = await fetchAllFeatures();
        return features;
      } catch (error) {
        console.error('Error fetching features:', error);
        return {};
      }
    }
  })
};

// No duplicate exports here - these are already exported above
