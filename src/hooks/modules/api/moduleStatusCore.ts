
import { AppModule, ModuleStatus } from "../types";

export function isAdminModule(moduleCode: string): boolean {
  return moduleCode === 'admin' || moduleCode.startsWith('admin_');
}

export function isSystemModule(moduleCode: string): boolean {
  return moduleCode === 'system' || moduleCode === 'core';
}

export function isCoreModule(module: AppModule): boolean {
  return module.is_core === true;
}
