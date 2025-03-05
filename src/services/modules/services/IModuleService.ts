
import { AppModule, ModuleStatus } from "@/hooks/modules/types";

export interface IModuleService {
  getAllModules(): Promise<AppModule[]>;
  getModuleByCode(code: string): Promise<AppModule | null>;
  getModuleById(id: string): Promise<AppModule | null>;
  updateModuleStatus(moduleId: string, status: ModuleStatus): Promise<boolean>;
  recordModuleUsage(moduleCode: string): Promise<void>;
  isModuleActive(moduleCode: string): Promise<boolean>;
  createModule(module: Omit<AppModule, "id" | "created_at" | "updated_at">): Promise<AppModule>;
  updateModule(id: string, module: Partial<AppModule>): Promise<AppModule>;
  deleteModule(id: string): Promise<boolean>;
}
