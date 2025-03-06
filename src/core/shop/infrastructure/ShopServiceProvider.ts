
import { ShopService } from '../application/ShopService';
import { ShopRepository } from './ShopRepository';
import { IShopRepository } from '../domain/interfaces/IShopRepository';

class TypedShopRepository extends ShopRepository implements IShopRepository {}

const shopRepository = new TypedShopRepository();
export const shopService = new ShopService(shopRepository);
