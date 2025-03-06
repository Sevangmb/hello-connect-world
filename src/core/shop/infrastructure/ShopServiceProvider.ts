
import { ShopService } from '../application/ShopService';
import { ShopRepository } from './ShopRepository';
import { IShopRepository } from '../domain/interfaces/IShopRepository';

let shopService: ShopService | null = null;
let shopRepository: IShopRepository | null = null;

// Initialize repositories
export const getShopRepository = (): IShopRepository => {
  if (!shopRepository) {
    shopRepository = new ShopRepository();
  }
  return shopRepository;
};

// Initialize service
export const getShopService = (): ShopService => {
  if (!shopService) {
    const repository = getShopRepository();
    shopService = new ShopService(repository);
  }
  return shopService;
};
