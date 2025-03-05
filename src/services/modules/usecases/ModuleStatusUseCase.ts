
/**
 * Cas d'utilisation pour la gestion des statuts de modules
 */
import { AppModule, ModuleStatus } from '@/hooks/modules/types';
import { ADMIN_MODULE_CODE } from '@/hooks/modules/constants';
import { ModuleRepository } from '../repositories/ModuleRepository';

class ModuleStatusUseCase {
  private moduleRepository: ModuleRepository;

  constructor() {
    this.moduleRepository = new ModuleRepository();
  }

  /**
   * Met à jour le statut d'un module
   */
  async updateModuleStatus(moduleId: string, status: ModuleStatus, currentModule: AppModule): Promise<boolean> {
    // Vérifier si c'est un module admin ou core
    if (currentModule.is_admin || currentModule.code === ADMIN_MODULE_CODE || currentModule.code.startsWith('admin_')) {
      if (status !== 'active') {
        console.error("Les modules d'administration ne peuvent pas être désactivés");
        return false;
      }
    }

    if (currentModule.is_core) {
      if (status !== 'active' && status !== 'degraded') {
        console.error("Les modules core ne peuvent être qu'actifs ou en mode dégradé");
        return false;
      }
    }

    // Mettre à jour le statut dans la base de données
    try {
      return await this.moduleRepository.updateModuleStatus(moduleId, status);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      return false;
    }
  }

  /**
   * Vérifie si un module est actif
   */
  isModuleActive(moduleCode: string, modules: AppModule[]): boolean {
    // L'admin est toujours actif
    if (moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin_')) {
      return true;
    }

    const module = modules.find(m => m.code === moduleCode);
    return module ? module.status === 'active' : false;
  }

  /**
   * Vérifie si un module est en mode dégradé
   */
  isModuleDegraded(moduleCode: string, modules: AppModule[]): boolean {
    // L'admin n'est jamais en mode dégradé
    if (moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin_')) {
      return false;
    }

    const module = modules.find(m => m.code === moduleCode);
    return module ? module.status === 'degraded' : false;
  }

  /**
   * Met à jour le cache de statuts des modules
   */
  updateStatusCache(modules: AppModule[]): void {
    // Construire un objet de cache rapide pour les statuts
    const statuses: Record<string, ModuleStatus> = {};
    modules.forEach(module => {
      statuses[module.code] = module.status;
    });

    // Stocker dans le localStorage
    try {
      localStorage.setItem('app_modules_status_cache', JSON.stringify(statuses));
      localStorage.setItem('app_modules_status_timestamp', Date.now().toString());
    } catch (e) {
      console.error("Erreur lors de la mise en cache des statuts:", e);
    }
  }
}

// Exporter une instance unique
export const moduleStatusUseCase = new ModuleStatusUseCase();
