
/**
 * Queries pour le panier utilisant le service de catalogue
 */
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "./types";
import { getCatalogService } from "@/core/catalog/infrastructure/catalogDependencyProvider";

const catalogService = getCatalogService();

// Fetch cart items from Supabase with optimized catalog integration
export async function fetchCartItems(userId: string | null): Promise<CartItem[]> {
  if (!userId) {
    return [];
  }

  try {
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

    // Use promise.all to fetch all catalog items in parallel for better performance
    const cartItemsPromises = cartItemsData.map(async cartItem => {
      const shopItem = await catalogService.getItemById(cartItem.shop_item_id);
      
      if (!shopItem) {
        console.warn(`Shop item with id ${cartItem.shop_item_id} not found`);
        return null;
      }
      
      return {
        id: cartItem.id,
        quantity: cartItem.quantity,
        shop_items: {
          id: shopItem.id,
          name: shopItem.name,
          description: shopItem.description || null,
          price: shopItem.price,
          image_url: shopItem.imageUrl || null,
          stock: 999, // Default value since stock column doesn't exist
          seller_id: shopItem.sellerId,
          shop_id: shopItem.shopId,
          shops: {
            name: shopItem.metadata?.shopName || "Boutique inconnue"
          }
        }
      };
    });
    
    const cartItems = await Promise.all(cartItemsPromises);
    
    // Filter out any null items (those that weren't found)
    return cartItems.filter(item => item !== null) as CartItem[];
  } catch (error) {
    console.error("Error in fetchCartItems:", error);
    throw error;
  }
}

// Check if item exists in cart - optimized with direct query
export async function checkCartItemExists(userId: string, itemId: string) {
  if (!userId) {
    return null;
  }
  
  try {
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
  } catch (error) {
    console.error("Error in checkCartItemExists:", error);
    throw error;
  }
}

// Fetch item details for stock checking
export async function fetchItemDetails(itemId: string) {
  try {
    const catalogItem = await catalogService.getItemById(itemId);
    
    if (!catalogItem) {
      throw new Error("Impossible de récupérer les détails de l'article");
    }
    
    return {
      shopItemData: {
        id: catalogItem.id,
        price: catalogItem.price,
        clothes_id: catalogItem.metadata?.clothesId
      },
      clothesData: {
        name: catalogItem.name,
        stock: 999 // Default value since stock doesn't exist
      }
    };
  } catch (error) {
    console.error("Error in fetchItemDetails:", error);
    throw error;
  }
}

// Add new item to cart
export async function addItemToCart(userId: string, itemId: string, quantity: number) {
  try {
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
  } catch (error) {
    console.error("Error in addItemToCart:", error);
    throw error;
  }
}

// Update existing cart item
export async function updateCartItemQuantity(userId: string, cartItemId: string, quantity: number) {
  try {
    const { data, error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", cartItemId)
      .eq("user_id", userId)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error in updateCartItemQuantity:", error);
    throw error;
  }
}

// Remove item from cart
export async function removeCartItem(userId: string, cartItemId: string) {
  try {
    const { data, error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", cartItemId)
      .eq("user_id", userId)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error in removeCartItem:", error);
    throw error;
  }
}

// Clear cart
export async function clearCart(userId: string) {
  try {
    const { data, error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", userId)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error in clearCart:", error);
    throw error;
  }
}

// Get cart item details for stock checking
export async function getCartItemWithStock(cartItemId: string) {
  try {
    // Get cart item details
    const { data: cartItem, error: cartItemError } = await supabase
      .from("cart_items")
      .select("shop_item_id")
      .eq("id", cartItemId)
      .single();

    if (cartItemError || !cartItem) {
      throw new Error("Article introuvable dans votre panier");
    }

    // Use catalog service for item details
    const catalogItem = await catalogService.getItemById(cartItem.shop_item_id);
    
    if (!catalogItem) {
      throw new Error("Impossible de récupérer les détails de l'article");
    }
    
    return {
      cartItem,
      shopItemData: {
        id: catalogItem.id,
        clothes_id: catalogItem.metadata?.clothesId
      },
      clothesData: {
        name: catalogItem.name,
        stock: 999 // Default value since stock doesn't exist
      }
    };
  } catch (error) {
    console.error("Error in getCartItemWithStock:", error);
    throw error;
  }
}
