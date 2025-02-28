
import { supabase } from "@/integrations/supabase/client";
import { CartItem, CartQueryResult } from "./types";

// Fetch cart items from Supabase
export async function fetchCartItems(userId: string | null): Promise<CartItem[]> {
  if (!userId) {
    return [];
  }

  // First, get the cart items
  const { data: cartItemsData, error: cartError } = await supabase
    .from("cart_items")
    .select(`
      id,
      quantity,
      shop_item_id
    `)
    .eq("user_id", userId);

  if (cartError) {
    console.error("Error fetching cart items:", cartError);
    throw cartError;
  }

  if (!cartItemsData || cartItemsData.length === 0) {
    return [];
  }

  // Now fetch all the shop_items data
  const shopItemIds = cartItemsData.map(item => item.shop_item_id);
  
  const { data: shopItemsData, error: shopItemsError } = await supabase
    .from("shop_items")
    .select(`
      id,
      price,
      shop_id,
      clothes_id,
      shops:shop_id (name)
    `)
    .in("id", shopItemIds);

  if (shopItemsError) {
    console.error("Error fetching shop items:", shopItemsError);
    throw shopItemsError;
  }

  // Get clothes details for the shop items
  const clothesIds = shopItemsData.map(item => item.clothes_id);
  
  const { data: clothesData, error: clothesError } = await supabase
    .from("clothes")
    .select(`
      id,
      name,
      description,
      image_url
    `)
    .in("id", clothesIds);

  if (clothesError) {
    console.error("Error fetching clothes details:", clothesError);
    throw clothesError;
  }

  // Map the data together to return the expected CartItem[] format
  return cartItemsData.map(cartItem => {
    const shopItem = shopItemsData.find(item => item.id === cartItem.shop_item_id);
    if (!shopItem) {
      throw new Error(`Shop item with id ${cartItem.shop_item_id} not found`);
    }
    
    const clothesItem = clothesData.find(item => item.id === shopItem.clothes_id);
    if (!clothesItem) {
      throw new Error(`Clothes item for shop item ${shopItem.id} not found`);
    }

    return {
      id: cartItem.id,
      quantity: cartItem.quantity,
      shop_items: {
        id: shopItem.id,
        name: clothesItem.name || "Produit sans nom",
        description: clothesItem.description || null,
        price: shopItem.price,
        image_url: clothesItem.image_url || null,
        stock: 0, // Remplacé par une valeur par défaut puisque cette colonne n'existe pas
        seller_id: "", // Remplacé par une valeur par défaut puisque cette colonne n'existe pas
        shop_id: shopItem.shop_id,
        shops: {
          name: shopItem.shops?.name || "Boutique inconnue"
        }
      }
    };
  });
}

// Check if item exists in cart
export async function checkCartItemExists(userId: string, itemId: string) {
  if (!userId) {
    return null;
  }
  
  const { data, error } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("user_id", userId)
    .eq("shop_item_id", itemId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

// Fetch item details for stock checking
export async function fetchItemDetails(itemId: string) {
  // Get shop item details
  const { data: shopItemData, error: shopItemError } = await supabase
    .from("shop_items")
    .select(`
      id, 
      price,
      clothes_id
    `)
    .eq("id", itemId)
    .single();

  if (shopItemError) {
    console.error("Error fetching item details:", shopItemError);
    throw new Error("Impossible de récupérer les détails de l'article");
  }

  // Get clothes details separately
  const { data: clothesData, error: clothesError } = await supabase
    .from("clothes")
    .select(`
      name
    `)
    .eq("id", shopItemData.clothes_id)
    .single();

  if (clothesError) {
    console.error("Error fetching clothes details:", clothesError);
    throw new Error("Impossible de récupérer les détails du vêtement");
  }

  // Puisque 'stock' n'existe pas, nous utilisons une valeur par défaut
  return {
    shopItemData,
    clothesData: {
      ...clothesData,
      stock: 999 // Utilisation d'une valeur par défaut élevée
    }
  };
}

// Add new item to cart
export async function addItemToCart(userId: string, itemId: string, quantity: number) {
  const { data, error } = await supabase
    .from("cart_items")
    .insert({
      user_id: userId,
      shop_item_id: itemId,
      quantity,
    })
    .select();

  if (error) throw error;
  return data;
}

// Update existing cart item
export async function updateCartItemQuantity(userId: string, cartItemId: string, quantity: number) {
  const { data, error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", cartItemId)
    .eq("user_id", userId)
    .select();

  if (error) throw error;
  return data;
}

// Remove item from cart
export async function removeCartItem(userId: string, cartItemId: string) {
  const { data, error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", cartItemId)
    .eq("user_id", userId)
    .select();

  if (error) throw error;
  return data;
}

// Clear cart
export async function clearCart(userId: string) {
  const { data, error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", userId)
    .select();

  if (error) throw error;
  return data;
}

// Get cart item details for stock checking
export async function getCartItemWithStock(cartItemId: string) {
  // Get cart item details
  const { data: cartItem, error: cartItemError } = await supabase
    .from("cart_items")
    .select("shop_item_id")
    .eq("id", cartItemId)
    .single();

  if (cartItemError || !cartItem) {
    throw new Error("Article introuvable dans votre panier");
  }

  // Get shop item details
  const { data: shopItemData, error: shopItemError } = await supabase
    .from("shop_items")
    .select(`
      id,
      clothes_id
    `)
    .eq("id", cartItem.shop_item_id)
    .single();

  if (shopItemError) {
    console.error("Error fetching item details:", shopItemError);
    throw new Error("Impossible de récupérer les détails de l'article");
  }

  // Get clothes details separately
  const { data: clothesData, error: clothesError } = await supabase
    .from("clothes")
    .select(`
      name
    `)
    .eq("id", shopItemData.clothes_id)
    .single();

  if (clothesError) {
    console.error("Error fetching clothes details:", clothesError);
    throw new Error("Impossible de récupérer les détails du vêtement");
  }

  // Puisque 'stock' n'existe pas, nous utilisons une valeur par défaut
  return {
    cartItem,
    shopItemData,
    clothesData: {
      ...clothesData,
      stock: 999 // Utilisation d'une valeur par défaut élevée
    }
  };
}
