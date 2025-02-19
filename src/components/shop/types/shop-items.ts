
export interface ShopItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  shop_id: string;
  seller_id: string;
  category?: string;
  size?: string;
  brand?: string;
  original_price?: number;
  status: string;
}

export interface RawShopItem {
  id: string;
  price: number;
  original_price: number | null;
  status: string;
  created_at: string;
  clothes: {
    name: string;
    description: string | null;
    image_url: string | null;
    category: string | null;
    size: string | null;
    brand: string | null;
    original_price: number | null;
  };
  shop: {
    id: string;
    name: string;
    user_id: string;
  };
}
