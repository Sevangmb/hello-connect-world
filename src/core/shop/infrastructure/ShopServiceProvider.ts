
import { IShopService } from '../application/interfaces/IShopService';
import { ShopServiceImpl } from './ShopServiceImpl';

// Instance singleton du service
let shopService: IShopService | null = null;

/**
 * Récupère ou crée une instance du service de boutique
 * @returns IShopService
 */
export const getShopService = (): IShopService => {
  if (!shopService) {
    shopService = new ShopServiceImpl();
  }
  
  return shopService;
};

/**
 * Réinitialise l'instance du service (utile pour les tests)
 */
export const resetShopService = (): void => {
  shopService = null;
};
