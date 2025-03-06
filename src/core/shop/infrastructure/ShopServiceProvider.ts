
import { ShopService } from '../application/ShopService';
import { ShopRepository } from './ShopRepository';
import { IShopRepository } from '../domain/interfaces/IShopRepository';

// Create the repository
const shopRepository: IShopRepository = new ShopRepository();

// Create the service with the repository
export const shopService = new ShopService(shopRepository);
