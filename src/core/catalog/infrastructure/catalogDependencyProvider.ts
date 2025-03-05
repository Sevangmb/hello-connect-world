
/**
 * Fournisseur de dépendances pour le service de catalogue
 */
import { CatalogService } from '../application/CatalogService';
import { SupabaseCatalogRepository } from './SupabaseCatalogRepository';

// Singleton pour le repository
let catalogRepository: SupabaseCatalogRepository | null = null;

// Singleton pour le service
let catalogService: CatalogService | null = null;

/**
 * Fournit une instance du repository de catalogue
 */
export function getCatalogRepository(): SupabaseCatalogRepository {
  if (!catalogRepository) {
    catalogRepository = new SupabaseCatalogRepository();
  }
  return catalogRepository;
}

/**
 * Fournit une instance du service de catalogue
 */
export function getCatalogService(): CatalogService {
  if (!catalogService) {
    const repository = getCatalogRepository();
    catalogService = new CatalogService(repository);
  }
  return catalogService;
}
