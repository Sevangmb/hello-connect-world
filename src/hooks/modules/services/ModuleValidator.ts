
/**
 * Service de validation des modules et de leurs dépendances
 * Vérifie les règles métier sur la structure et l'activation des modules
 */
import { AppModule, ModuleStatus } from "../types";
import { ADMIN_MODULE_CODE } from "../constants";

class ModuleValidator {
  /**
   * Valide qu'un statut de module est conforme au type ModuleStatus
   */
  validateModuleStatus(status: any): ModuleStatus {
    if (status === 'active' || status === 'inactive' || status === 'degraded') {
      return status as ModuleStatus;
    }
    // Statut par défaut en cas de valeur invalide
    console.warn(`ModuleValidator: Statut de module invalide "${status}", utilisation de "inactive" par défaut`);
    return 'inactive';
  }

  /**
   * Vérifie si un module peut être désactivé 
   * (pas de dépendances actives requérant ce module)
   */
  canDeactivateModule(
    moduleId: string, 
    moduleCode: string,
    isCore: boolean,
    dependencies: any[]
  ): boolean {
    // Les modules core ne peuvent pas être désactivés
    if (isCore) {
      console.log(`ModuleValidator: Le module core ${moduleCode} ne peut pas être désactivé`);
      return false;
    }

    // Le module admin ne peut pas être désactivé
    if (moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin_')) {
      console.log(`ModuleValidator: Le module admin ${moduleCode} ne peut pas être désactivé`);
      return false;
    }

    // Vérifier que ce module n'est pas requis par d'autres modules actifs
    const requiredBy = dependencies.filter(d => 
      d.dependency_id === moduleId && 
      d.is_required && 
      d.module_status === 'active'
    );

    if (requiredBy.length > 0) {
      console.log(`ModuleValidator: Le module ${moduleCode} ne peut pas être désactivé car il est requis par ${requiredBy.length} autres modules actifs`);
      requiredBy.forEach(dep => {
        console.log(`  - Requis par: ${dep.module_name} (${dep.module_code})`);
      });
      return false;
    }

    return true;
  }

  /**
   * Vérifie si un module peut être activé
   * (toutes ses dépendances requises sont actives)
   */
  canActivateModule(
    moduleId: string, 
    moduleCode: string,
    dependencies: any[]
  ): boolean {
    // Vérifier que toutes les dépendances requises sont actives
    const requiredDependencies = dependencies.filter(d => 
      d.module_id === moduleId && 
      d.is_required
    );

    const inactiveDependencies = requiredDependencies.filter(d => 
      d.dependency_status !== 'active'
    );

    if (inactiveDependencies.length > 0) {
      console.log(`ModuleValidator: Le module ${moduleCode} ne peut pas être activé car il a ${inactiveDependencies.length} dépendances requises inactives`);
      inactiveDependencies.forEach(dep => {
        console.log(`  - Dépendance inactive: ${dep.dependency_name} (${dep.dependency_code}), statut: ${dep.dependency_status}`);
      });
      return false;
    }

    return true;
  }

  /**
   * Détermine le statut approprié d'un module en fonction de ses dépendances
   */
  determineModuleStatus(
    moduleCode: string, 
    currentStatus: ModuleStatus,
    dependencies: any[]
  ): ModuleStatus {
    // Si c'est le module admin, il est toujours actif
    if (moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin_')) {
      return 'active';
    }

    // Si déjà inactif, on ne change rien
    if (currentStatus === 'inactive') {
      return 'inactive';
    }

    // Vérifier s'il manque des dépendances requises
    const moduleDependencies = dependencies.filter(d => 
      d.module_code === moduleCode
    );

    const requiredDependencies = moduleDependencies.filter(d => d.is_required);
    const inactiveRequiredDependencies = requiredDependencies.filter(d => 
      d.dependency_status !== 'active'
    );

    // S'il manque des dépendances requises, le module doit être inactif
    if (inactiveRequiredDependencies.length > 0) {
      return 'inactive';
    }

    // Vérifier s'il manque des dépendances optionnelles
    const optionalDependencies = moduleDependencies.filter(d => !d.is_required);
    const inactiveOptionalDependencies = optionalDependencies.filter(d => 
      d.dependency_status !== 'active'
    );

    // S'il manque des dépendances optionnelles, le module peut être en mode dégradé
    if (inactiveOptionalDependencies.length > 0) {
      return 'degraded';
    }

    // Si tout est bon, le module est actif
    return 'active';
  }

  /**
   * Valide un module entier
   * @returns Le module avec un statut corrigé si nécessaire
   */
  validateModule(module: AppModule, dependencies: any[]): AppModule {
    // Valider le statut
    let status = this.validateModuleStatus(module.status);

    // Déterminer le statut en fonction des dépendances
    const computedStatus = this.determineModuleStatus(
      module.code,
      status,
      dependencies
    );

    // Si le statut calculé est différent, on le corrige
    if (computedStatus !== status) {
      console.log(`ModuleValidator: Correction du statut du module ${module.code} de ${status} à ${computedStatus}`);
      status = computedStatus;
    }

    return { ...module, status };
  }

  /**
   * Valide tous les modules et leurs interdépendances
   * @returns Les modules avec des statuts corrigés si nécessaire
   */
  validateAllModules(modules: AppModule[], dependencies: any[]): AppModule[] {
    // Première passe: valider les statuts individuels
    const firstPassModules = modules.map(module => ({
      ...module,
      status: this.validateModuleStatus(module.status)
    }));

    // Deuxième passe: ajouter les dépendances pour valider les statuts
    const validatedModules = firstPassModules.map(module => 
      this.validateModule(module, dependencies)
    );

    return validatedModules;
  }
}

// Créer et exporter une instance unique pour toute l'application
export const moduleValidator = new ModuleValidator();
