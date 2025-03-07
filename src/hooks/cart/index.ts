
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartRepository } from '@/core/shop/infrastructure/repositories/CartRepository';
import { CartItem } from '@/core/shop/domain/types/cart-types';
import { useToast } from '@/hooks/use-toast';

export interface AddToCartParams {
  userId: string;
  shopItemId: string;
  quantity: number;
}

export interface UpdateQuantityParams {
  cartItemId: string;
  quantity: number;
}

export function useCart(userId: string | null) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [subtotal, setSubtotal] = useState(0);

  // Récupérer les éléments du panier
  const {
    data: cartItems = [],
    isLoading: isCartLoading,
    refetch: refetchCart
  } = useQuery({
    queryKey: ['cartItems', userId],
    queryFn: async () => {
      if (!userId) return [];
      return await cartRepository.getCartItems(userId);
    },
    enabled: !!userId,
  });

  // Récupérer le nombre d'éléments dans le panier
  const {
    data: cartCount = 0,
    isLoading: isCountLoading,
    refetch: refetchCount
  } = useQuery({
    queryKey: ['cartCount', userId],
    queryFn: async () => {
      if (!userId) return 0;
      return await cartRepository.getCartCount(userId);
    },
    enabled: !!userId,
  });

  // Mutation pour ajouter au panier
  const addToCart = useMutation({
    mutationFn: async ({ userId, shopItemId, quantity }: AddToCartParams) => {
      return await cartRepository.addToCart({
        user_id: userId,
        shop_item_id: shopItemId,
        quantity
      });
    },
    onSuccess: () => {
      toast({
        description: "Article ajouté au panier",
      });
      queryClient.invalidateQueries({ queryKey: ['cartItems'] });
      queryClient.invalidateQueries({ queryKey: ['cartCount'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter l'article au panier",
      });
      console.error("Erreur d'ajout au panier:", error);
    }
  });

  // Mutation pour mettre à jour la quantité
  const updateQuantity = useMutation({
    mutationFn: async ({ cartItemId, quantity }: UpdateQuantityParams) => {
      return await cartRepository.updateQuantity(cartItemId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartItems'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour la quantité",
      });
      console.error("Erreur de mise à jour de quantité:", error);
    }
  });

  // Mutation pour supprimer du panier
  const removeFromCart = useMutation({
    mutationFn: async (cartItemId: string) => {
      return await cartRepository.removeFromCart(cartItemId);
    },
    onSuccess: () => {
      toast({
        description: "Article retiré du panier",
      });
      queryClient.invalidateQueries({ queryKey: ['cartItems'] });
      queryClient.invalidateQueries({ queryKey: ['cartCount'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de retirer l'article du panier",
      });
      console.error("Erreur de suppression du panier:", error);
    }
  });

  // Mutation pour vider le panier
  const clearCart = useMutation({
    mutationFn: async (userId: string) => {
      return await cartRepository.clearCart(userId);
    },
    onSuccess: () => {
      toast({
        description: "Panier vidé avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ['cartItems'] });
      queryClient.invalidateQueries({ queryKey: ['cartCount'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de vider le panier",
      });
      console.error("Erreur lors du vidage du panier:", error);
    }
  });

  // Calculer le sous-total
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const total = cartItems.reduce((sum, item) => {
        return sum + (item.shop_items.price * item.quantity);
      }, 0);
      setSubtotal(total);
    } else {
      setSubtotal(0);
    }
  }, [cartItems]);

  return {
    cartItems,
    cartCount,
    isCartLoading: isCartLoading || isCountLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refetchCart,
    subtotal
  };
}

// No duplicate type exports here
