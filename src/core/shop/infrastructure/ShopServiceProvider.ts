
import { ShopService } from '../application/ShopService';
import { ShopRepository } from './ShopRepository';
import { IShopRepository } from '../domain/interfaces/IShopRepository';

// Create a properly typed repository instance
const shopRepository: IShopRepository = new ShopRepository();

// Create and export the shop service
export const shopService = new ShopService(shopRepository);
