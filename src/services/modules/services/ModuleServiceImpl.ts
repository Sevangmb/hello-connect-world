import { AppModule, ModuleStatus } from '@/hooks/modules/types';
import { IModuleService } from './IModuleService';
import { ModuleRepository } from '../repositories/ModuleRepository';
import { ModuleValidator } from '../utils/ModuleValidator';

export class ModuleServiceImpl implements IModuleService {
  private moduleRepository: ModuleRepository;
  private moduleValidator: ModuleValidator;

  constructor() {
    this.moduleRepository = new ModuleRepository();
    this.moduleValidator = new ModuleValidator();
  }

  async getAllModules(): Promise<AppModule[]> {
    try {
      return await this.moduleRepository.getAllModules();
    } catch (error) {
      console.error('Error getting all modules:', error);
      return [];
    }
  }

  async getModuleById(id: string): Promise<AppModule | null> {
    try {
      return await this.moduleRepository.getModuleById(id);
    } catch (error) {
      console.error(`Error getting module by id ${id}:`, error);
      return null;
    }
  }

  async getModuleByCode(code: string): Promise<AppModule | null> {
    try {
      return await this.moduleRepository.getModuleByCode(code);
    } catch (error) {
      console.error(`Error getting module by code ${code}:`, error);
      return null;
    }
  }

  async updateModuleStatus(id: string, status: ModuleStatus): Promise<boolean> {
    try {
      // Validate status
      const validStatus = this.moduleValidator.validateStatus(status);
      if (!validStatus) {
        console.error(`Invalid module status: ${status}`);
        return false;
      }

      // Check if module exists
      const module = await this.moduleRepository.getModuleById(id);
      if (!module) {
        console.error(`Module with id ${id} does not exist`);
        return false;
      }

      // Don't allow disabling core modules
      if (module.is_core && status !== 'active') {
        console.error(`Cannot disable core module ${module.code}`);
        return false;
      }

      // Update status
      return await this.moduleRepository.updateModuleStatus(id, status);
    } catch (error) {
      console.error(`Error updating module status for ${id}:`, error);
      return false;
    }
  }

  async createModule(module: Omit<AppModule, 'id' | 'created_at' | 'updated_at' | 'features'>): Promise<AppModule | null> {
    try {
      // Validate module
      const validModule = this.moduleValidator.validateModule(module);
      if (!validModule) {
        console.error(`Invalid module: ${module.code}`);
        return null;
      }

      // Create module
      return await this.moduleRepository.createModule(module);
    } catch (error) {
      console.error('Error creating module:', error);
      return null;
    }
  }

  async updateModule(module: Partial<AppModule> & { id: string }): Promise<AppModule | null> {
    try {
      // Validate module
      const validModule = this.moduleValidator.validatePartialModule(module);
      if (!validModule) {
        console.error(`Invalid module: ${module.code}`);
        return null;
      }

      // Update module
      return await this.moduleRepository.updateModule(module);
    } catch (error) {
      console.error(`Error updating module ${module.id}:`, error);
      return null;
    }
  }

  async deleteModule(id: string): Promise<boolean> {
    try {
      // Check if module exists
      const module = await this.moduleRepository.getModuleById(id);
      if (!module) {
        console.error(`Module with id ${id} does not exist`);
        return false;
      }

      // Don't allow deleting core modules
      if (module.is_core) {
        console.error(`Cannot delete core module ${module.code}`);
        return false;
      }

      // Delete module
      return await this.moduleRepository.deleteModule(id);
    } catch (error) {
      console.error(`Error deleting module ${id}:`, error);
      return false;
    }
  }
}
