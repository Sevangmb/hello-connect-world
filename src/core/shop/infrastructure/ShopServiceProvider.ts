
import { ShopRepository } from './ShopRepository';
import { ShopService } from '../application/ShopService';
import { IShopRepository } from '../domain/interfaces/IShopRepository';

// Create and export the repository instance
export const shopRepository: IShopRepository = new ShopRepository();

// Create and export the service instance
export const shopService = new ShopService(shopRepository);
