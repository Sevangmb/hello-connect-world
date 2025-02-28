
import { ShoppingCart } from "lucide-react";

export interface CartItem {
  id: string;
  quantity: number;
  shop_items: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    image_url: string | null;
    stock: number;
    seller_id: string;
    shop_id: string;
    shops: {
      name: string;
    }
  };
}

export interface CartQueryResult {
  id: string;
  quantity: number;
  shop_items: {
    id: string;
    price: number;
    seller_id: string;
    shop_id: string;
    shops: {
      name: string;
    }
  };
  shop_items_clothes: {
    clothes: {
      name: string;
      description: string | null;
      image_url: string | null;
      stock: number;
    } | null;
  } | null;
}

export interface AddToCartParams {
  itemId: string;
  quantity?: number;
}

export interface UpdateCartItemParams {
  cartItemId: string;
  quantity: number;
}
