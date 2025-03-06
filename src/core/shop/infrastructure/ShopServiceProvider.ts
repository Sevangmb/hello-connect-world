
import { ShopService } from '../application/ShopService';
import { ShopRepository } from './ShopRepository';
import { IShopRepository } from '../domain/interfaces/IShopRepository';

// Create the repository instance
const shopRepository: IShopRepository = new ShopRepository();

// Instance of the service
const shopService = new ShopService(shopRepository);

// Export the service for use in the application
export { shopService };

// Function to obtain the service if needed in other parts of the application
export const getShopService = (): ShopService => {
  return shopService;
};
