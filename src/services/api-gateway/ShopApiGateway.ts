
import { BaseApiGateway } from './BaseApiGateway';
import { ShopService } from '@/core/shop/application/ShopService';
import { ShopRepository } from '@/core/shop/infrastructure/ShopRepository';
import { Shop, ShopItem, Order, ShopStatus, OrderStatus } from '@/core/shop/domain/types';
import { IShopRepository } from '@/core/shop/domain/interfaces/IShopRepository';

export class ShopApiGateway extends BaseApiGateway {
  private shopService: ShopService;
  
  constructor() {
    super();
    // Create a proper implementation of IShopRepository
    const shopRepository: IShopRepository = new ShopRepository();
    this.shopService = new ShopService(shopRepository);
  }
  
  /**
   * Get shop by id
   */
  getShopById(id: string) {
    return this.shopService.getShopById(id);
  }
  
  /**
   * Get shop by user id
   */
  getShopByUserId(userId: string) {
    return this.shopService.getShopByUserId(userId);
  }
  
  /**
   * Create a new shop
   */
  createShop(shopData: Partial<Shop>) {
    return this.shopService.createShop(shopData);
  }
  
  /**
   * Update shop details
   */
  updateShop(id: string, shopData: Partial<Shop>) {
    return this.shopService.updateShop(id, shopData);
  }
  
  /**
   * Update shop item
   */
  updateShopItem(id: string, itemData: Partial<ShopItem>) {
    return this.shopService.updateShopItem(id, itemData);
  }
  
  /**
   * Delete shop item
   */
  deleteShopItem(itemId: string) {
    return this.shopService.deleteShopItem(itemId);
  }
  
  /**
   * Get shop settings
   */
  getShopSettings(shopId: string) {
    return this.shopService.getShopSettings(shopId);
  }
  
  /**
   * Update shop settings
   */
  updateShopSettings(shopId: string, settings: any) {
    return this.shopService.updateShopSettings(shopId, settings);
  }
  
  /**
   * Update shop status
   */
  updateShopStatus(shopId: string, status: ShopStatus) {
    return this.shopService.updateShopStatus(shopId, status);
  }
  
  /**
   * Update order status
   */
  updateOrderStatus(orderId: string, status: OrderStatus) {
    return this.shopService.updateOrderStatus(orderId, status);
  }
}

export const shopApiGateway = new ShopApiGateway();
