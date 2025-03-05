
import { ShopService } from "../application/ShopService";
import { IShopRepository } from "../domain/interfaces/IShopRepository";
import { ShopRepository } from "./ShopRepository";

// Singleton instance
let shopServiceInstance: ShopService | null = null;

// Create a new instance of ShopService with ShopRepository
export const getShopService = (): ShopService => {
  if (!shopServiceInstance) {
    const shopRepository = new ShopRepository() as IShopRepository;
    shopServiceInstance = new ShopService(shopRepository);
  }
  return shopServiceInstance;
};

// Alias for backward compatibility
export const getShopServiceInstance = getShopService;
