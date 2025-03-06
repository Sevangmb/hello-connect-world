
import { ShopService } from '@/core/shop/application/ShopService';
import { ShopRepository } from '@/core/shop/infrastructure/ShopRepository';

export class ShopApiGateway {
  private shopService: ShopService;

  constructor() {
    this.shopService = new ShopService(new ShopRepository());
  }

  public async getShopById(id: string) {
    try {
      return await this.shopService.getShopById(id);
    } catch (error) {
      console.error('Error getting shop:', error);
      return null;
    }
  }

  public async getUserShops(userId: string) {
    try {
      return await this.shopService.getUserShops(userId);
    } catch (error) {
      console.error('Error getting user shops:', error);
      return [];
    }
  }

  public async getShopItems(shopId: string) {
    try {
      return await this.shopService.getShopItems(shopId);
    } catch (error) {
      console.error('Error getting shop items:', error);
      return [];
    }
  }

  public async getCartItems(userId: string) {
    try {
      return await this.shopService.getCartItems(userId);
    } catch (error) {
      console.error('Error getting cart items:', error);
      return [];
    }
  }

  public async addToCart(userId: string, shopItemId: string, quantity: number = 1) {
    try {
      return await this.shopService.addToCart(userId, shopItemId, quantity);
    } catch (error) {
      console.error('Error adding to cart:', error);
      return null;
    }
  }

  public async removeFromCart(cartItemId: string) {
    try {
      return await this.shopService.removeFromCart(cartItemId);
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    }
  }
}
