
import { ShopService } from '../application/ShopService';
import { ShopRepository } from './ShopRepository';
import { IShopRepository } from '../domain/repository/IShopRepository';

let shopRepository: IShopRepository | null = null;
let shopService: ShopService | null = null;

// Utilisation de la notation de casting pour garantir la compatibilité des types
export const getShopService = (): ShopService => {
  if (!shopService) {
    if (!shopRepository) {
      shopRepository = new ShopRepository() as unknown as IShopRepository;
    }
    shopService = new ShopService(shopRepository);
  }
  return shopService;
};
