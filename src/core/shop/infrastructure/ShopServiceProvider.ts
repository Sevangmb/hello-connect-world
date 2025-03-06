
import { ShopService } from '../application/ShopService';
import { ShopRepository } from './ShopRepository';

let shopServiceInstance: ShopService | null = null;

export const getShopServiceInstance = (): ShopService => {
  if (!shopServiceInstance) {
    const shopRepository = new ShopRepository();
    shopServiceInstance = new ShopService(shopRepository);
  }
  return shopServiceInstance;
};
