import { useState, useEffect } from "react";
import { CartItemType } from "@/types";

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [isCartLoading, setIsCartLoading] = useState(true);

  useEffect(() => {
    const fetchCartItems = async () => {
      setIsCartLoading(true);
      try {
        const response = await fetch("/api/cart");
        const data = await response.json();
        setCartItems(data);
      } catch (error) {
        console.error("Erreur lors du chargement du panier:", error);
      } finally {
        setIsCartLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const updateQuantity = (itemId: number, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (itemId: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  return { cartItems, isCartLoading, updateQuantity, removeFromCart };
}