
import { ShopService } from '../application/ShopService';
import { ShopRepository } from './ShopRepository';
import { IShopRepository } from '../domain/interfaces/IShopRepository';

// Create the repository instance - type assertion needed due to interface differences
// that will be addressed with proper implementations
const shopRepository: IShopRepository = new ShopRepository() as IShopRepository;

// Instance of the service
const shopService = new ShopService(shopRepository);

// Export the service for use in the application
export { shopService };

// Function to obtain the service if needed in other parts of the application
export const getShopService = (): ShopService => {
  return shopService;
};
