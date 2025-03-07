
/**
 * Types for shopping cart
 */

// Élément du panier
export interface CartItem {
  id: string;
  user_id: string;
  shop_item_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  shop_items: {
    name: string;
    price: number;
    image_url?: string;
    id: string;
  };
  shop: {
    name: string;
    id: string;
  };
  shop_id?: string; // Made optional since it's derived from the shop_item
}

// Base cart item for DB operations
export interface DbCartItem {
  id?: string;
  user_id: string;
  shop_item_id: string;
  quantity: number;
  created_at?: string;
  updated_at?: string;
}
