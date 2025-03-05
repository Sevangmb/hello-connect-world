
import { AppModule, ModuleStatus } from "@/hooks/modules/types";
import { IModuleService } from "./IModuleService";
import { ModuleRepository } from "../repositories/ModuleRepository";
import { ModuleValidator } from "../utils/ModuleValidator";

export class ModuleServiceImpl implements IModuleService {
  private repository: ModuleRepository;
  private validator: ModuleValidator;

  constructor(repository: ModuleRepository) {
    this.repository = repository;
    this.validator = new ModuleValidator();
  }

  /**
   * Get all modules
   */
  async getAllModules(): Promise<AppModule[]> {
    try {
      return await this.repository.getAllModules();
    } catch (error) {
      console.error("Error fetching modules:", error);
      return [];
    }
  }

  /**
   * Get module by code
   */
  async getModuleByCode(code: string): Promise<AppModule | null> {
    try {
      return await this.repository.getModuleByCode(code);
    } catch (error) {
      console.error(`Error fetching module with code ${code}:`, error);
      return null;
    }
  }

  /**
   * Get module by ID
   */
  async getModuleById(id: string): Promise<AppModule | null> {
    try {
      return await this.repository.getModuleById(id);
    } catch (error) {
      console.error(`Error fetching module with ID ${id}:`, error);
      return null;
    }
  }

  /**
   * Update module status
   */
  async updateModuleStatus(moduleId: string, status: ModuleStatus): Promise<boolean> {
    try {
      const validStatus = this.validator.validateStatus(status);
      return await this.repository.updateModuleStatus(moduleId, validStatus);
    } catch (error) {
      console.error(`Error updating module status for ${moduleId}:`, error);
      return false;
    }
  }

  /**
   * Create a new module
   */
  async createModule(module: Omit<AppModule, "id" | "created_at" | "updated_at">): Promise<AppModule> {
    try {
      const validatedModule = this.validator.validateModule(module);
      return await this.repository.createModule(validatedModule);
    } catch (error) {
      console.error("Error creating module:", error);
      throw error;
    }
  }

  /**
   * Update an existing module
   */
  async updateModule(id: string, module: Partial<AppModule>): Promise<AppModule> {
    try {
      const validatedUpdate = this.validator.validatePartialModule(module);
      return await this.repository.updateModule(id, validatedUpdate);
    } catch (error) {
      console.error(`Error updating module ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a module
   */
  async deleteModule(id: string): Promise<boolean> {
    try {
      return await this.repository.deleteModule(id);
    } catch (error) {
      console.error(`Error deleting module ${id}:`, error);
      return false;
    }
  }

  /**
   * Record module usage
   */
  async recordModuleUsage(moduleCode: string): Promise<void> {
    try {
      // Implementation would go here
      console.log(`Recording usage for module ${moduleCode}`);
      // This would typically update a usage counter in the database
    } catch (error) {
      console.error(`Error recording module usage for ${moduleCode}:`, error);
    }
  }

  /**
   * Check if a module is active
   */
  async isModuleActive(moduleCode: string): Promise<boolean> {
    try {
      const module = await this.repository.getModuleByCode(moduleCode);
      return module?.status === 'active';
    } catch (error) {
      console.error(`Error checking if module ${moduleCode} is active:`, error);
      return false;
    }
  }
}
