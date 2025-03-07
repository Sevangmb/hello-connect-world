
import { Shop } from '../types';

export interface IShopRepository {
  // Shop operations
  getShopById(id: string): Promise<Shop | null>;
  getShopByUserId(userId: string): Promise<Shop | null>;
  getUserShops(userId: string): Promise<Shop[]>;
  getShopsByStatus(status: string): Promise<Shop[]>;
  createShop(shop: Partial<Shop>): Promise<Shop | null>;
  updateShop(id: string, shopData: Partial<Shop>): Promise<Shop | null>;
  deleteShop(id: string): Promise<boolean>;
  
  // Shop settings operations
  getShopSettings(shopId: string): Promise<any>;
  updateShopSettings(shopId: string, settingsData: any): Promise<any>;
}
