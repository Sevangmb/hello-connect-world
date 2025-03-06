
import { ShopService } from '@/core/shop/application/ShopService';
import { ShopRepository } from '@/core/shop/infrastructure/ShopRepository';
import { Shop, ShopItem, CartItem, Order } from '@/core/shop/domain/types';

export class ShopApiGateway {
  private shopService: ShopService;

  constructor() {
    // Utilisation d'un ShopRepository temporaire pour contourner l'erreur de typage
    const repository = new ShopRepository() as any;
    this.shopService = new ShopService(repository);
  }

  public async getShopById(id: string): Promise<Shop | null> {
    try {
      return await this.shopService.getShopById(id);
    } catch (error) {
      console.error(`Error getting shop ${id}:`, error);
      return null;
    }
  }

  public async getUserShops(): Promise<Shop[]> {
    try {
      // Implémentation temporaire
      return [];
    } catch (error) {
      console.error('Error getting user shops:', error);
      return [];
    }
  }

  public async getShopItems(): Promise<ShopItem[]> {
    try {
      return await this.shopService.getAllShopItems();
    } catch (error) {
      console.error('Error getting shop items:', error);
      return [];
    }
  }

  public async getCartItems(): Promise<CartItem[]> {
    try {
      // Implémentation temporaire
      return [];
    } catch (error) {
      console.error('Error getting cart items:', error);
      return [];
    }
  }

  public async addToCart(userId: string, itemId: string, quantity: number): Promise<CartItem | null> {
    try {
      // Implémentation temporaire
      return null;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return null;
    }
  }

  public async removeFromCart(id: string): Promise<boolean> {
    try {
      // Implémentation temporaire
      return false;
    } catch (error) {
      console.error(`Error removing item ${id} from cart:`, error);
      return false;
    }
  }

  public async getShopByUserId(userId: string): Promise<Shop | null> {
    try {
      return await this.shopService.getShopByUserId(userId);
    } catch (error) {
      console.error(`Error getting shop for user ${userId}:`, error);
      return null;
    }
  }

  public async createShop(shopData: Partial<Shop>): Promise<Shop | null> {
    try {
      return await this.shopService.createShop(shopData);
    } catch (error) {
      console.error('Error creating shop:', error);
      return null;
    }
  }

  public async updateShop(id: string, updates: Partial<Shop>): Promise<Shop | null> {
    try {
      return await this.shopService.updateShop(id, updates);
    } catch (error) {
      console.error(`Error updating shop ${id}:`, error);
      return null;
    }
  }

  public async getOrders(userId: string): Promise<Order[]> {
    try {
      // Implémentation temporaire
      return [];
    } catch (error) {
      console.error(`Error getting orders for user ${userId}:`, error);
      return [];
    }
  }
}

// Export d'une instance
export const shopApiGateway = new ShopApiGateway();
