
export interface CartItemType {
  id: string;
  quantity: number;
  shop_items: {
    id: string;
    price: number;
    clothes: {
      name: string;
      image_url: string | null;
    } | null;
  };
}
