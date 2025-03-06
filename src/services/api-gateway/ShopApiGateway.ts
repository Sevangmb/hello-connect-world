
import { Shop, ShopItem } from '@/core/shop/domain/types';
import { shopService } from '@/core/shop/infrastructure/ShopServiceProvider';

export class ShopApiGateway {
  private shopService = shopService;

  public async getShopByUserId(userId: string): Promise<Shop | null> {
    try {
      return await this.shopService.getShopByUserId(userId);
    } catch (error) {
      console.error('Error getting shop by user ID:', error);
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

  public async getShopItems(shopId: string): Promise<ShopItem[]> {
    try {
      return await this.shopService.getShopItems(shopId);
    } catch (error) {
      console.error(`Error getting items for shop ${shopId}:`, error);
      return [];
    }
  }

  public async getAllItems(): Promise<ShopItem[]> {
    try {
      return await this.shopService.getAllShopItems();
    } catch (error) {
      console.error('Error getting all shop items:', error);
      return [];
    }
  }

  public async getShopById(shopId: string): Promise<Shop | null> {
    try {
      return await this.shopService.getShopById(shopId);
    } catch (error) {
      console.error(`Error getting shop ${shopId}:`, error);
      return null;
    }
  }

  public async createShopItem(itemData: Partial<ShopItem>): Promise<ShopItem | null> {
    try {
      return await this.shopService.createShopItem(itemData);
    } catch (error) {
      console.error('Error creating shop item:', error);
      return null;
    }
  }

  public async updateShop(shopId: string, shopData: Partial<Shop>): Promise<Shop | null> {
    try {
      return await this.shopService.updateShop(shopId, shopData);
    } catch (error) {
      console.error(`Error updating shop ${shopId}:`, error);
      return null;
    }
  }
}

// Export a singleton instance
export const shopApiGateway = new ShopApiGateway();
