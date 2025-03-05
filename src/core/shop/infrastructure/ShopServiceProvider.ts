
import { ShopService } from '../application/ShopService';
import { ShopRepository } from './ShopRepository';
import { IShopRepository } from '../domain/repository/IShopRepository';

export const getShopRepository = (): IShopRepository => {
  return new ShopRepository();
};

export const getShopService = (): ShopService => {
  // Cast the repository to IShopRepository to satisfy TypeScript
  const repository = getShopRepository();
  return new ShopService(repository);
};
