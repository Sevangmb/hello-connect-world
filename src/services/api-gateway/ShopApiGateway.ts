
import { ShopService } from '@/core/shop/application/ShopService';
import { Shop, ShopItem, Order } from '@/core/shop/domain/types';

export class ShopApiGateway {
  private shopService: ShopService;

  constructor(shopService: ShopService) {
    this.shopService = shopService;
  }

  async getUserShop(userId: string): Promise<Shop | null> {
    try {
      return await this.shopService.getUserShop(userId);
    } catch (error) {
      console.error('Error getting user shop:', error);
      return null;
    }
  }

  async getShopById(shopId: string): Promise<Shop | null> {
    try {
      return await this.shopService.getShopById(shopId);
    } catch (error) {
      console.error('Error getting shop by id:', error);
      return null;
    }
  }

  async getAllShopItems(): Promise<ShopItem[]> {
    try {
      return await this.shopService.getShopItems();
    } catch (error) {
      console.error('Error getting all shop items:', error);
      return [];
    }
  }

  async getShopItems(shopId: string): Promise<ShopItem[]> {
    try {
      return await this.shopService.getShopItems(shopId);
    } catch (error) {
      console.error('Error getting shop items:', error);
      return [];
    }
  }

  async getShopOrders(shopId: string): Promise<Order[]> {
    try {
      return await this.shopService.getOrdersByShopId(shopId);
    } catch (error) {
      console.error('Error getting shop orders:', error);
      return [];
    }
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      return await this.shopService.getOrdersByUserId(userId);
    } catch (error) {
      console.error('Error getting user orders:', error);
      return [];
    }
  }
}
