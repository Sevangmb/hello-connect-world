
import { ShopItem } from '../types';

export interface IShopItemRepository {
  getShopItems(shopId: string): Promise<ShopItem[]>;
  getShopItemById(id: string): Promise<ShopItem | null>;
  createShopItem(item: Omit<ShopItem, "id" | "created_at" | "updated_at">): Promise<ShopItem | null>;
  updateShopItem(id: string, updates: Partial<ShopItem>): Promise<ShopItem | null>;
  deleteShopItem(id: string): Promise<boolean>;
}
