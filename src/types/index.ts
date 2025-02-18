
export interface CartItemType {
  id: string;
  quantity: number;
  shop_items: {
    id: string;
    price: number;
    clothes: {
      name: string;
      image_url: string;
    };
  };
}

export interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
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
