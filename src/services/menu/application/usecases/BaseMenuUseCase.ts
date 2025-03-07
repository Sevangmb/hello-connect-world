
import { IMenuRepository } from '../../domain/interfaces/IMenuRepository';

/**
 * Cas d'utilisation de base pour le menu
 * Fournit la base commune pour tous les cas d'utilisation de menu
 */
export abstract class BaseMenuUseCase {
  constructor(protected menuRepository: IMenuRepository) {}
}
