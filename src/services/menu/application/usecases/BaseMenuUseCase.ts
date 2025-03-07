
import { IMenuRepository } from '../../domain/interfaces/IMenuRepository';

/**
 * Classe de base abstraite pour les cas d'utilisation du menu
 * Fournit un accès au repository et des méthodes communes
 */
export abstract class BaseMenuUseCase {
  constructor(protected menuRepository: IMenuRepository) {}
}
