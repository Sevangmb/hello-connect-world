
import { 
  Shop, 
  ShopItem, 
  ShopStatus, 
  Order, 
  ShopReview, 
  ShopSettings,
  PaymentMethod,
  DeliveryOption,
  OrderStatus
} from "../types";

export interface IShopRepository {
  // Shop methods
  getShopById(id: string): Promise<Shop | null>;
  getUserShop(userId: string): Promise<Shop | null>;
  getShops(): Promise<Shop[]>;
  createShop(shopData: Omit<Shop, "id" | "created_at" | "updated_at" | "average_rating">): Promise<Shop>;
  updateShop(id: string, shopData: Partial<Shop>): Promise<Shop>;
  updateShopStatus(id: string, status: ShopStatus): Promise<boolean>;
  
  // Shop items methods
  getShopItems(shopId: string): Promise<ShopItem[]>;
  getShopItemById(id: string): Promise<ShopItem | null>;
  createShopItem(itemData: Omit<ShopItem, "id" | "created_at" | "updated_at">): Promise<ShopItem>;
  updateShopItem(id: string, itemData: Partial<ShopItem>): Promise<ShopItem>;
  deleteShopItem(id: string): Promise<boolean>;
  updateShopItemStatus(id: string, status: string): Promise<boolean>;
  
  // Shop reviews methods
  getShopReviews(shopId: string): Promise<ShopReview[]>;
  addShopReview(review: Omit<ShopReview, "id" | "created_at" | "updated_at">): Promise<ShopReview>;
  
  // Orders methods
  getShopOrders(shopId: string): Promise<Order[]>;
  getUserOrders(userId: string): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | null>;
  createOrder(orderData: Omit<Order, "id" | "created_at" | "updated_at">, items: Omit<Order["items"][0], "id">[]): Promise<Order>;
  updateOrderStatus(id: string, status: OrderStatus): Promise<boolean>;
  
  // Shop settings methods
  getShopSettings(shopId: string): Promise<ShopSettings | null>;
  updateShopSettings(id: string, settings: Partial<ShopSettings>): Promise<boolean>;
}
