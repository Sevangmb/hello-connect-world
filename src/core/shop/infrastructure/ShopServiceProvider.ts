
import { ShopRepository } from './ShopRepository';
import { ShopService } from '../application/ShopService';

// Singleton instance
let shopServiceInstance: ShopService | null = null;

/**
 * Gets or creates a ShopService instance
 */
export const getShopService = (): ShopService => {
  if (!shopServiceInstance) {
    const repository = new ShopRepository();
    shopServiceInstance = new ShopService(repository);
  }
  
  return shopServiceInstance;
};

/**
 * Reset the shop service (useful for testing)
 */
export const resetShopService = (): void => {
  shopServiceInstance = null;
};

/**
 * Creates a new shop service with custom repository (useful for testing)
 */
export const createShopService = (repository: any): ShopService => {
  return new ShopService(repository);
};
