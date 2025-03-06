
import { ShopService } from '../application/ShopService';
import { ShopRepository } from './ShopRepository';

/**
 * Provider for the ShopService
 * This is used to create and provide an instance of the ShopService
 */
export class ShopServiceProvider {
  private static instance: ShopService;

  /**
   * Get the instance of ShopService
   */
  public static getInstance(): ShopService {
    if (!ShopServiceProvider.instance) {
      // Create the repository
      const shopRepository = new ShopRepository();
      
      // Create the service with the repository
      ShopServiceProvider.instance = new ShopService();
    }
    
    return ShopServiceProvider.instance;
  }
}

// Export a singleton instance
export const shopServiceProvider = ShopServiceProvider.getInstance();
