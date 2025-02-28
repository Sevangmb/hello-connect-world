
import { supabase } from "@/integrations/supabase/client";
import { CartItem, CartQueryResult } from "./types";

// Fetch cart items from Supabase
export async function fetchCartItems(userId: string | null): Promise<CartItem[]> {
  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from("cart_items")
    .select(`
      id,
      quantity,
      shop_items:shop_item_id (
        id,
        price,
        seller_id,
        shop_id,
        shops:shop_id (name)
      ),
      shop_items_clothes:shop_item_id (
        clothes (
          name,
          description,
          image_url,
          stock
        )
      )
    `)
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  // Transformer les données pour correspondre à l'interface CartItem
  return (data as CartQueryResult[]).map((item) => ({
    id: item.id,
    quantity: item.quantity,
    shop_items: {
      id: item.shop_items.id,
      name: item.shop_items_clothes?.clothes?.name || "Produit sans nom",
      description: item.shop_items_clothes?.clothes?.description || null,
      price: item.shop_items.price,
      image_url: item.shop_items_clothes?.clothes?.image_url || null,
      stock: item.shop_items_clothes?.clothes?.stock || 0,
      seller_id: item.shop_items.seller_id,
      shop_id: item.shop_items.shop_id,
      shops: {
        name: item.shop_items.shops?.name || "Boutique inconnue"
      }
    }
  }));
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
      price
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
      name,
      stock
    `)
    .eq("id", shopItemData.clothes_id)
    .single();

  if (clothesError) {
    console.error("Error fetching clothes details:", clothesError);
    throw new Error("Impossible de récupérer les détails du vêtement");
  }

  return {
    shopItemData,
    clothesData
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
      id
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
      name,
      stock
    `)
    .eq("id", shopItemData.clothes_id)
    .single();

  if (clothesError) {
    console.error("Error fetching clothes details:", clothesError);
    throw new Error("Impossible de récupérer les détails du vêtement");
  }

  return {
    cartItem,
    shopItemData,
    clothesData
  };
}
