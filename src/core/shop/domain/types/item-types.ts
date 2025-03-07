
/**
 * Types for shop items
 */

// Statuts des articles
export type ShopItemStatus = 'available' | 'sold_out' | 'archived';

// Types pour les articles
export interface ShopItem {
  id: string;
  shop_id: string;
  name: string;
  description?: string;
  image_url?: string;
  price: number;
  original_price?: number;
  stock: number;
  status: ShopItemStatus;
  created_at: string;
  updated_at: string;
  clothes_id?: string;
  shop?: {
    name: string;
    id?: string;
  };
}
