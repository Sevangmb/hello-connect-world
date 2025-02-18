
export interface CartItemType {
  id: string;
  shop_items: {
    id: string;
    price: number;
    clothes: {
      name: string;
      image_url: string;
    };
  };
  quantity: number;
}

export interface Cart {
  items: CartItemType[];
  total: number;
}

export interface UseCart {
  cartItems: CartItemType[];
  isLoading: boolean;
  addToCart: any;
  updateQuantity: any;
  removeFromCart: any;
}
