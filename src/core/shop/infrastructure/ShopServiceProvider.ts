
import { ShopService } from '../application/ShopService';
import { ShopRepository } from './ShopRepository';

let shopService: ShopService | null = null;

export const getShopService = (): ShopService => {
  if (!shopService) {
    const shopRepository = new ShopRepository();
    shopService = new ShopService(shopRepository);
  }
  return shopService;
};
