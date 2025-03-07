
import { Shop, ShopSettings } from '../types';

export interface IShopRepository {
  getShopById(id: string): Promise<Shop | null>;
  getUserShops(userId: string): Promise<Shop[]>;
  updateShop(id: string, updates: Partial<Shop>): Promise<Shop | null>;
  createShop(shop: Partial<Shop>): Promise<Shop | null>;
  getShopSettings(shopId: string): Promise<ShopSettings | null>;
  updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings | null>;
}
