
import { AppModule, ModuleStatus } from "@/hooks/modules/types";
import { ModuleEventPublisher } from "./services/ModuleEventPublisher";
import { FeatureStatusUseCase } from "./usecases/FeatureStatusUseCase";
import { ModuleStatusUseCase } from "./usecases/ModuleStatusUseCase";

/**
 * Service for managing modules and their features
 */
export class ModuleService {
  private eventPublisher: ModuleEventPublisher;
  private moduleStatusUseCase: ModuleStatusUseCase;
  private featureStatusUseCase: FeatureStatusUseCase;

  constructor(
    eventPublisher: ModuleEventPublisher,
    moduleStatusUseCase: ModuleStatusUseCase,
    featureStatusUseCase: FeatureStatusUseCase
  ) {
    this.eventPublisher = eventPublisher;
    this.moduleStatusUseCase = moduleStatusUseCase;
    this.featureStatusUseCase = featureStatusUseCase;
  }

  /**
   * Initialize the module service with event subscriptions
   */
  init(): void {
    console.log("Initializing ModuleService");
    // Subscribe to module status change events
    this.eventPublisher.subscribe("moduleStatusChanged", (moduleId: string, status: string) => {
      console.log(`Module ${moduleId} status changed to ${status}`);
    });

    // Subscribe to feature status change events
    this.eventPublisher.subscribe(
      "featureStatusChanged",
      (moduleCode: string, featureCode: string, isEnabled: boolean) => {
        console.log(
          `Feature ${featureCode} of module ${moduleCode} ${isEnabled ? "enabled" : "disabled"}`
        );
      }
    );
  }

  /**
   * Get a list of all modules
   */
  async getAllModules(): Promise<AppModule[]> {
    console.log("Getting all modules");
    return this.moduleStatusUseCase.getAllModules();
  }

  /**
   * Get a specific module by id
   */
  async getModuleById(id: string): Promise<AppModule | null> {
    console.log(`Getting module with id: ${id}`);
    return this.moduleStatusUseCase.getModuleById(id);
  }

  /**
   * Get a specific module by code
   */
  async getModuleByCode(code: string): Promise<AppModule | null> {
    console.log(`Getting module with code: ${code}`);
    return this.moduleStatusUseCase.getModuleByCode(code);
  }

  /**
   * Update a module's status
   */
  async updateModuleStatus(id: string, status: ModuleStatus): Promise<boolean> {
    console.log(`Updating module ${id} status to ${status}`);
    const result = await this.moduleStatusUseCase.updateModuleStatus(id, status);
    
    if (result) {
      this.eventPublisher.publishModuleStatusChanged(id, status);
    }
    
    return result;
  }

  /**
   * Get a list of features for a module
   */
  async getFeaturesByModule(moduleCode: string): Promise<any[]> {
    console.log(`Getting features for module: ${moduleCode}`);
    return this.featureStatusUseCase.getFeaturesByModule(moduleCode);
  }

  /**
   * Update a feature's status
   */
  async updateFeatureStatus(
    moduleCode: string,
    featureCode: string,
    isEnabled: boolean
  ): Promise<boolean> {
    console.log(`Updating feature ${featureCode} status to ${isEnabled ? "enabled" : "disabled"}`);
    const result = await this.featureStatusUseCase.updateFeatureStatus(moduleCode, featureCode, isEnabled);
    
    if (result) {
      this.eventPublisher.publishFeatureStatusChanged(moduleCode, featureCode, isEnabled);
    }
    
    return result;
  }
}
