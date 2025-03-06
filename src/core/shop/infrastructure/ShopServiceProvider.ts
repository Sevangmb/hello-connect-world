
import { ShopService } from '../application/ShopService';
import { ShopRepository } from './ShopRepository';
import { IShopRepository } from '../domain/interfaces/IShopRepository';

// Singleton instance
let shopServiceInstance: ShopService | null = null;

// Create and export the shop repository instance
export const shopRepository: IShopRepository = new ShopRepository();

// Get shop service instance or create one if it doesn't exist
export const getShopService = (): ShopService => {
  if (!shopServiceInstance) {
    shopServiceInstance = new ShopService(shopRepository);
  }
  return shopServiceInstance;
};
