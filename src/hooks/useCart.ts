
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Check, Loader2, ShoppingCart } from "lucide-react";

// Types pour le panier
interface CartItem {
  id: string;
  product_id: string;
  user_id: string;
  quantity: number;
  product?: {
    id: string;
    name: string;
    price: number;
    image_url?: string;
    seller_id: string;
  };
}

export const useCart = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id || null);
    };
    
    checkUser();
    
    // Écouter les changements d'authentification
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUserId(session?.user?.id || null);
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Récupérer les éléments du panier
  const cartQuery = useQuery({
    queryKey: ["cart", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("cart_items")
        .select(`
          id,
          product_id,
          user_id,
          quantity,
          product:products(
            id,
            name,
            price,
            image_url,
            seller_id
          )
        `)
        .eq("user_id", userId);
        
      if (error) {
        console.error("Error fetching cart:", error);
        throw error;
      }
      
      return data as CartItem[];
    },
    enabled: !!userId,
  });

  // Calculer le total du panier
  const cartTotal = cartQuery.data?.reduce((total, item) => {
    return total + (item.product?.price || 0) * item.quantity;
  }, 0) || 0;

  // Ajouter un produit au panier
  const addToCart = useMutation({
    mutationFn: async ({ productId, quantity = 1 }: { productId: string; quantity?: number }) => {
      if (!userId) {
        toast({
          variant: "destructive",
          title: "Non connecté",
          description: "Vous devez être connecté pour ajouter des articles au panier",
          icon: <AlertCircle className="h-4 w-4" />,
        });
        throw new Error("Not authenticated");
      }
      
      // Vérifier si le produit existe déjà dans le panier
      const { data: existingItems } = await supabase
        .from("cart_items")
        .select()
        .eq("user_id", userId)
        .eq("product_id", productId)
        .maybeSingle();
        
      if (existingItems) {
        // Mettre à jour la quantité
        const { data, error } = await supabase
          .from("cart_items")
          .update({ quantity: existingItems.quantity + quantity })
          .eq("id", existingItems.id)
          .select();
          
        if (error) throw error;
        return data;
      } else {
        // Ajouter un nouvel élément
        const { data, error } = await supabase
          .from("cart_items")
          .insert({ user_id: userId, product_id: productId, quantity })
          .select();
          
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
      toast({
        title: "Article ajouté",
        description: "L'article a été ajouté à votre panier",
        icon: <ShoppingCart className="h-4 w-4" />,
        duration: 3000,
      });
    },
    onError: (error) => {
      console.error("Error adding to cart:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter cet article au panier",
        icon: <AlertCircle className="h-4 w-4" />,
      });
    }
  });

  // Mettre à jour la quantité d'un produit
  const updateQuantity = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      if (!userId) throw new Error("Not authenticated");
      
      if (quantity <= 0) {
        // Supprimer l'élément si la quantité est 0 ou négative
        const { data, error } = await supabase
          .from("cart_items")
          .delete()
          .eq("id", itemId)
          .eq("user_id", userId)
          .select();
          
        if (error) throw error;
        return data;
      } else {
        // Mettre à jour la quantité
        const { data, error } = await supabase
          .from("cart_items")
          .update({ quantity })
          .eq("id", itemId)
          .eq("user_id", userId)
          .select();
          
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
    },
    onError: (error) => {
      console.error("Error updating quantity:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour la quantité",
        icon: <AlertCircle className="h-4 w-4" />,
      });
    }
  });

  // Supprimer un produit du panier
  const removeFromCart = useMutation({
    mutationFn: async (itemId: string) => {
      if (!userId) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", itemId)
        .eq("user_id", userId)
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
      toast({
        title: "Article supprimé",
        description: "L'article a été retiré de votre panier",
        icon: <Check className="h-4 w-4 text-green-500" />,
        duration: 3000,
      });
    },
    onError: (error) => {
      console.error("Error removing from cart:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer cet article du panier",
        icon: <AlertCircle className="h-4 w-4" />,
      });
    }
  });

  // Vider le panier
  const clearCart = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("Not authenticated");
      
      // Toast de chargement
      const { dismiss } = toast({
        title: "Traitement en cours",
        description: "Vidage du panier en cours...",
        icon: <Loader2 className="h-4 w-4 animate-spin" />,
        duration: 5000,
      });
      
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", userId);
        
      dismiss();
      
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
      toast({
        title: "Panier vidé",
        description: "Tous les articles ont été retirés de votre panier",
        icon: <Check className="h-4 w-4 text-green-500" />,
        duration: 3000,
      });
    },
    onError: (error) => {
      console.error("Error clearing cart:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de vider votre panier",
        icon: <AlertCircle className="h-4 w-4" />,
      });
    }
  });

  return {
    cart: cartQuery.data || [],
    isLoading: cartQuery.isLoading,
    error: cartQuery.error,
    cartTotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };
};

export type { CartItem };
