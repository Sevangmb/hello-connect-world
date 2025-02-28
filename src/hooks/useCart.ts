
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShoppingCart, Check, AlertCircle, Trash2 } from "lucide-react";

export interface CartItem {
  id: string;
  user_id: string;
  shop_item_id: string;
  quantity: number;
  created_at: string;
  shop_items: {
    id: string;
    price: number;
    clothes: {
      name: string;
      image_url: string | null;
    };
  };
}

export function useCart() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [processingItems, setProcessingItems] = useState<Record<string, boolean>>({});
  const [cartCount, setCartCount] = useState(0);

  const { data: cartItems, isLoading: isCartLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      console.log("Fetching cart items...");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      console.log("User ID:", user.id);
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          shop_items!shop_item_id (
            id,
            price,
            clothes!shop_items_clothes_id_fkey (
              name,
              image_url
            )
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error("Error fetching cart items:", error);
        throw error;
      }

      console.log("Cart items fetched:", data);
      return data as CartItem[];
    },
    onSuccess: (data) => {
      // Mettre à jour le compteur d'éléments
      setCartCount(data?.length || 0);
    }
  });

  const addToCart = useMutation({
    mutationFn: async ({ shopItemId, quantity }: { shopItemId: string, quantity: number }) => {
      setLoading(true);
      
      // Toast de chargement
      const { dismiss } = toast({
        title: "Ajout en cours",
        description: "Ajout de l'article à votre panier...",
        icon: <Loader2 className="h-4 w-4 animate-spin" />,
        duration: 10000,
      });
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Récupérer les infos sur l'article
      const { data: itemInfo } = await supabase
        .from('shop_items')
        .select(`
          id,
          clothes!shop_items_clothes_id_fkey (
            name
          )
        `)
        .eq('id', shopItemId)
        .single();
      
      const itemName = itemInfo?.clothes?.name || "Article";

      // First check if the item already exists in the cart
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('shop_item_id', shopItemId)
        .single();

      let result;
      if (existingItem) {
        // Update existing item quantity
        const { data, error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id)
          .select();

        if (error) throw error;
        result = data;
        
        dismiss();
        toast({
          title: "Quantité mise à jour",
          description: `${itemName} (${quantity}) a été ajouté à votre panier`,
          icon: <Check className="h-4 w-4 text-green-500" />,
          duration: 3000,
        });
      } else {
        // Insert new item
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            shop_item_id: shopItemId,
            quantity
          })
          .select();

        if (error) throw error;
        result = data;
        
        dismiss();
        toast({
          title: "Ajouté au panier",
          description: `${itemName} (${quantity}) a été ajouté à votre panier`,
          icon: <ShoppingCart className="h-4 w-4" />,
          duration: 3000,
        });
      }
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: any) => {
      console.error('Error adding to cart:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'article au panier",
        variant: "destructive",
        icon: <AlertCircle className="h-4 w-4" />,
      });
    },
    onSettled: () => {
      setLoading(false);
    }
  });

  const updateQuantity = useMutation({
    mutationFn: async ({ cartItemId, quantity }: { cartItemId: string, quantity: number }) => {
      setProcessingItems(prev => ({ ...prev, [cartItemId]: true }));
      
      // Toast de chargement
      const { dismiss } = toast({
        title: "Mise à jour",
        description: "Mise à jour de la quantité...",
        icon: <Loader2 className="h-4 w-4 animate-spin" />,
        duration: 5000,
      });
      
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId);

      if (error) throw error;
      
      dismiss();
      toast({
        title: "Quantité mise à jour",
        description: "La quantité a été mise à jour avec succès",
        icon: <Check className="h-4 w-4 text-green-500" />,
        duration: 3000,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error('Error updating quantity:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la quantité",
        variant: "destructive",
        icon: <AlertCircle className="h-4 w-4" />,
      });
    },
    onSettled: (_, __, { cartItemId }) => {
      setProcessingItems(prev => ({ ...prev, [cartItemId]: false }));
    }
  });

  const removeFromCart = useMutation({
    mutationFn: async (cartItemId: string) => {
      setProcessingItems(prev => ({ ...prev, [cartItemId]: true }));
      
      // Toast de chargement
      const { dismiss } = toast({
        title: "Suppression",
        description: "Suppression de l'article...",
        icon: <Loader2 className="h-4 w-4 animate-spin" />,
        duration: 5000,
      });
      
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      if (error) throw error;
      
      dismiss();
      toast({
        title: "Article retiré",
        description: "L'article a été retiré de votre panier",
        icon: <Trash2 className="h-4 w-4" />,
        duration: 3000,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error('Error removing from cart:', error);
      toast({
        title: "Erreur",
        description: "Impossible de retirer l'article du panier",
        variant: "destructive",
        icon: <AlertCircle className="h-4 w-4" />,
      });
    },
    onSettled: (_, __, cartItemId) => {
      setProcessingItems(prev => ({ ...prev, [cartItemId]: false }));
    }
  });

  // Abonnement aux changements de panier en temps réel
  useEffect(() => {
    const subscribeToCartChanges = () => {
      const userId = supabase.auth.getUser().then(({ data }) => data.user?.id);
      if (!userId) return () => {};
      
      const channel = supabase
        .channel('cart-channel')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'cart_items',
            filter: `user_id=eq.${userId}`
          },
          (payload) => {
            console.log('Realtime cart update:', payload);
            queryClient.invalidateQueries({ queryKey: ['cart'] });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };
    
    const unsubscribe = subscribeToCartChanges();
    return () => {
      unsubscribe();
    };
  }, [queryClient]);

  const isItemProcessing = (itemId: string) => processingItems[itemId] || false;

  return {
    cartItems,
    isCartLoading,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    isItemProcessing,
    cartCount
  };
}
