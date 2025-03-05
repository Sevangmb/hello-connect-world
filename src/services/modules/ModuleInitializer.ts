import { ModuleService } from './ModuleService';
import { ModuleStatus } from '@/hooks/modules/types';

export class ModuleInitializer {
  private moduleService: ModuleService;
  private initializedModules: Set<string> = new Set();

  constructor() {
    this.moduleService = new ModuleService();
  }

  /**
   * Check if a module is initialized
   */
  isModuleInitialized(moduleCode: string): boolean {
    return this.initializedModules.has(moduleCode);
  }

  /**
   * Mark a module as initialized
   */
  markModuleAsInitialized(moduleCode: string): void {
    this.initializedModules.add(moduleCode);
  }

  /**
   * Check if all required modules are initialized
   */
  async areRequiredModulesInitialized(): Promise<boolean> {
    const coreModules = await this.moduleService.getCoreModules();
    return coreModules.every(module => this.isModuleInitialized(module.code));
  }

  /**
   * Check if a module can be initialized
   */
  async canInitializeModule(moduleCode: string): Promise<boolean> {
    // Check if module exists and is active
    const moduleStatus = await this.moduleService.getModuleStatus(moduleCode);
    if (!moduleStatus || moduleStatus !== 'active') {
      return false;
    }

    // Check dependencies
    const dependenciesOk = await this.moduleService.checkModuleDependencies(moduleCode);
    if (!dependenciesOk) {
      return false;
    }

    return true;
  }

  /**
   * Initialize a module
   */
  async initializeModule(moduleCode: string): Promise<boolean> {
    // Skip if already initialized
    if (this.isModuleInitialized(moduleCode)) {
      return true;
    }

    // Check if module can be initialized
    const canInitialize = await this.canInitializeModule(moduleCode);
    if (!canInitialize) {
      return false;
    }

    try {
      // Perform initialization
      const success = await this.moduleService.initializeModule(moduleCode);
      
      if (success) {
        this.markModuleAsInitialized(moduleCode);
      }
      
      return success;
    } catch (error) {
      console.error(`Error initializing module ${moduleCode}:`, error);
      return false;
    }
  }

  /**
   * Initialize all modules
   */
  async initializeModules(): Promise<boolean> {
    try {
      // Get all active modules
      const activeModules = await this.moduleService.getActiveModules();
      
      // Initialize core modules first
      const coreModules = activeModules.filter(m => m.is_core);
      for (const module of coreModules) {
        await this.initializeModule(module.code);
      }
      
      // Then initialize non-core modules
      const nonCoreModules = activeModules.filter(m => !m.is_core);
      for (const module of nonCoreModules) {
        await this.initializeModule(module.code);
      }
      
      return true;
    } catch (error) {
      console.error("Error initializing modules:", error);
      return false;
    }
  }

  /**
   * Reset initialization state
   */
  resetInitializationState(): void {
    this.initializedModules.clear();
  }

  /**
   * Get initialization status
   */
  getInitializationStatus(): { 
    totalModules: number; 
    initializedModules: number;
    initializedModulesList: string[];
  } {
    return {
      totalModules: 0, // This would need to be fetched from the service
      initializedModules: this.initializedModules.size,
      initializedModulesList: Array.from(this.initializedModules)
    };
  }
}
