
/**
 * Service de validation pour les modules
 * Vérifie que les données sont conformes aux attentes
 */
import { ModuleStatus } from '@/hooks/modules/types';

export class ModuleValidator {
  /**
   * Valide le statut d'un module
   * @param status Statut à valider
   * @returns ModuleStatus Statut validé (par défaut 'inactive' si invalide)
   */
  validateModuleStatus(status: any): ModuleStatus {
    const validStatuses: ModuleStatus[] = ['active', 'inactive', 'degraded'];
    
    if (validStatuses.includes(status as ModuleStatus)) {
      return status as ModuleStatus;
    }
    
    console.warn(`Statut de module invalide: ${status}, utilisation de 'inactive' par défaut`);
    return 'inactive';
  }

  /**
   * Valide un code de module
   * @param code Code à valider
   * @returns boolean True si le code est valide
   */
  isValidModuleCode(code: string): boolean {
    // Règles de validation des codes de modules
    // Exemple: uniquement des lettres, chiffres et underscore, minimum 3 caractères
    return /^[a-z0-9_]{3,}$/.test(code);
  }

  /**
   * Valide un code de fonctionnalité
   * @param code Code à valider
   * @returns boolean True si le code est valide
   */
  isValidFeatureCode(code: string): boolean {
    // Règles de validation des codes de fonctionnalités
    // Exemple: uniquement des lettres, chiffres et underscore, minimum 3 caractères
    return /^[a-z0-9_]{3,}$/.test(code);
  }
}

// Exporter une instance unique pour toute l'application
export const moduleValidator = new ModuleValidator();
