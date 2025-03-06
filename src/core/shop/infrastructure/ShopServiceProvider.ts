
import { ShopRepository } from './ShopRepository';
import { ShopService } from '../application/ShopService';

// Create and export the repository instance
export const shopRepository = new ShopRepository();

// Create and export the service instance
export const shopService = new ShopService(shopRepository);
