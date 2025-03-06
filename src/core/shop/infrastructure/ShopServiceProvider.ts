
import { ShopService } from '../application/ShopService';
import { ShopRepository } from './ShopRepository';
import { IShopRepository } from '../domain/interfaces/IShopRepository';

// Create a repository instance
const shopRepository: IShopRepository = new ShopRepository();

// Create and export a service instance
export const shopService = new ShopService(shopRepository);
