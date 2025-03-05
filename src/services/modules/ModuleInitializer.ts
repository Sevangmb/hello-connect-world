
import { ModuleService } from "./ModuleService";

// Create a singleton instance
let moduleServiceInstance: ModuleService | null = null;

export const initializeModuleSystem = async (): Promise<void> => {
  if (!moduleServiceInstance) {
    moduleServiceInstance = new ModuleService();
  }

  try {
    // Initialize core modules first
    const coreModules = await moduleServiceInstance.getCoreModules();
    
    for (const module of coreModules) {
      await moduleServiceInstance.initializeModule(module.code);
    }
    
    console.log("Core modules initialized successfully");
    
    // Then initialize non-core modules
    const nonCoreModules = await moduleServiceInstance.getAllModules();
    const modules = nonCoreModules.filter(m => !m.is_core && m.status === 'active');
    
    for (const module of modules) {
      await moduleServiceInstance.initializeModule(module.code);
    }
    
    console.log("All modules initialized successfully");
  } catch (error) {
    console.error("Error initializing modules:", error);
  }
};
