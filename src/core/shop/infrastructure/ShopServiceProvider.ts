
import { ShopService } from '../application/ShopService';
import { ShopRepository } from './ShopRepository';
import { IShopRepository } from '../domain/interfaces/IShopRepository';

export function provideShopService(): ShopService {
  const repository: IShopRepository = new ShopRepository();
  return new ShopService(repository);
}
