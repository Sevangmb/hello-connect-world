
import { ShopItem } from "@/core/shop/domain/types";

export type CartItem = {
  id: string;
  user_id: string;
  shop_id: string;
  item_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  shop_items: {
    id: string;
    name: string;
    price: number;
    image_url?: string;
    shop_id: string;
  };
  shop: {
    id: string;
    name: string;
  };
};

export type AddToCartParams = {
  user_id: string;
  item_id: string;
  quantity: number;
};

export type UpdateQuantityParams = {
  cartItemId: string;
  quantity: number;
};

export type CartSummary = {
  totalItems: number;
  totalPrice: number;
  shops: number;
};
