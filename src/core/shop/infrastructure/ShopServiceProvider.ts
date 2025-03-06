
import { ShopService } from '../application/ShopService';
import { ShopRepository } from './ShopRepository';
import { IShopRepository } from '../domain/interfaces/IShopRepository';

// Instance du repository
const shopRepository: IShopRepository = new ShopRepository();

// Instance du service
const shopService = new ShopService(shopRepository);

// Exporter le service pour qu'il soit utilisé dans l'application
export { shopService };

// Fonction pour obtenir le service si nécessaire dans d'autres parties de l'application
export const getShopService = (): ShopService => {
  return shopService;
};
