import { ModuleStatus } from '@/hooks/modules/types';
import { ModuleRepository } from '../repositories/ModuleRepository';
import { supabase } from '@/integrations/supabase/client';

class ModuleStatusUseCaseImpl {
  private moduleRepo: ModuleRepository;

  constructor(moduleRepo: ModuleRepository) {
    this.moduleRepo = moduleRepo;
  }

  async isModuleActive(moduleCode: string): Promise<boolean> {
    try {
      const module = await this.moduleRepo.getModuleByCode(moduleCode);
      return module?.status === 'active';
    } catch (error) {
      console.error(`Error checking if module ${moduleCode} is active:`, error);
      return false;
    }
  }

  async getModuleStatus(moduleCode: string): Promise<ModuleStatus | null> {
    try {
      const module = await this.moduleRepo.getModuleByCode(moduleCode);
      return module?.status || null;
    } catch (error) {
      console.error(`Error getting status for module ${moduleCode}:`, error);
      return null;
    }
  }

  async updateModuleStatus(moduleId: string, status: ModuleStatus): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('app_modules')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', moduleId);

      if (error) {
        console.error(`Error updating module ${moduleId} status:`, error);
        return false;
      }
      return true;
    } catch (error) {
      console.error(`Error updating module ${moduleId} status:`, error);
      return false;
    }
  }
}

// Create and export a singleton instance
const moduleRepo = new ModuleRepository();
export const moduleStatusUseCase = new ModuleStatusUseCaseImpl(moduleRepo);
