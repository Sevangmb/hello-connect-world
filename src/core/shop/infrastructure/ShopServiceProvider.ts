
import { ShopService } from '../application/ShopService';
import { ShopRepository } from './ShopRepository';
import { IShopRepository } from '../domain/interfaces/IShopRepository';

// Create a proper repository instance that implements IShopRepository
const shopRepository: IShopRepository = new ShopRepository();

export const shopService = new ShopService(shopRepository);
