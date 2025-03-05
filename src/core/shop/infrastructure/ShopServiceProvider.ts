
import { ShopService } from '../application/ShopService';
import { ShopRepository } from './ShopRepository';
import { IShopRepository } from '../domain/repository/IShopRepository';

// Singleton instances
let shopRepository: IShopRepository | null = null;
let shopService: ShopService | null = null;

export const getShopService = (): ShopService => {
  if (!shopService) {
    if (!shopRepository) {
      shopRepository = new ShopRepository();
    }
    shopService = new ShopService(shopRepository);
  }
  return shopService;
};

// Pour le testing et la réinitialisation
export const resetShopService = (): void => {
  shopRepository = null;
  shopService = null;
};
