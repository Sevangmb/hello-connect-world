export interface CartItem {
  id: string;
  shop_items: {
    price: number;
    clothes: {
      name: string;
      image_url: string;
    };
  };
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface UseCart {
  cartItems: CartItem[];
  isCartLoading: boolean;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
}