
import { ShopService } from '../application/ShopService';
import { ShopRepository } from './ShopRepository';
import { IShopRepository } from '../domain/interfaces/IShopRepository';

// Implement a simple ShopRepository for now
export const shopRepository = new ShopRepository();
export const shopService = new ShopService(shopRepository as unknown as IShopRepository);
