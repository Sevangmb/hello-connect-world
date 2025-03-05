
import { AppModule, ModuleStatus } from "@/hooks/modules/types";

/**
 * Validator for module operations
 */
export class ModuleValidator {
  /**
   * Validates module status
   */
  validateStatus(status: string): ModuleStatus {
    if (status === 'active' || status === 'inactive' || status === 'degraded' || status === 'maintenance') {
      return status as ModuleStatus;
    }
    return 'inactive';
  }
  
  /**
   * Validates a complete module
   */
  validateModule(module: any): Omit<AppModule, "id" | "created_at" | "updated_at"> {
    // Implement validation logic here
    return {
      ...module,
      status: this.validateStatus(module.status || 'inactive'),
      is_core: Boolean(module.is_core),
      is_admin: Boolean(module.is_admin),
      priority: Number(module.priority || 0),
      name: String(module.name || ''),
      code: String(module.code || ''),
      version: String(module.version || '1.0.0'),
      description: String(module.description || '')
    };
  }
  
  /**
   * Validates partial module update
   */
  validatePartialModule(module: Partial<AppModule>): Partial<AppModule> {
    const validated: Partial<AppModule> = { ...module };
    
    if (module.status) {
      validated.status = this.validateStatus(module.status);
    }
    
    return validated;
  }
}
