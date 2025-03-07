
import { supabase } from '@/integrations/supabase/client';
import { CartItem, DbCartItem } from '@/core/shop/domain/types/cart-types';

/**
 * Repository pour gérer les opérations liées au panier
 */
export class CartRepository {
  /**
   * Récupère tous les éléments du panier d'un utilisateur
   */
  async getCartItems(userId: string): Promise<CartItem[]> {
    if (!userId) return [];
    
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        shop_items (
          id,
          name,
          price,
          image_url
        ),
        shop: shop_items(shop (
          id,
          name
        ))
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erreur lors de la récupération du panier:', error);
      throw error;
    }
    
    return data as CartItem[];
  }
  
  /**
   * Ajoute un élément au panier
   */
  async addToCart(item: DbCartItem): Promise<CartItem | null> {
    // Vérifier si l'élément existe déjà dans le panier
    const { data: existingItems, error: checkError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', item.user_id)
      .eq('shop_item_id', item.shop_item_id)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Erreur lors de la vérification du panier:', checkError);
      throw checkError;
    }
    
    // Si l'élément existe déjà, mettre à jour la quantité
    if (existingItems) {
      const newQuantity = existingItems.quantity + item.quantity;
      
      const { data: updatedItem, error: updateError } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
        .eq('id', existingItems.id)
        .select(`
          *,
          shop_items (
            id,
            name,
            price,
            image_url
          ),
          shop: shop_items(shop (
            id,
            name
          ))
        `)
        .single();
      
      if (updateError) {
        console.error('Erreur lors de la mise à jour du panier:', updateError);
        throw updateError;
      }
      
      return updatedItem as CartItem;
    }
    
    // Sinon, ajouter un nouvel élément
    const { data: newItem, error: insertError } = await supabase
      .from('cart_items')
      .insert([{
        user_id: item.user_id,
        shop_item_id: item.shop_item_id,
        quantity: item.quantity,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select(`
        *,
        shop_items (
          id,
          name,
          price,
          image_url
        ),
        shop: shop_items(shop (
          id,
          name
        ))
      `)
      .single();
    
    if (insertError) {
      console.error('Erreur lors de l\'ajout au panier:', insertError);
      throw insertError;
    }
    
    return newItem as CartItem;
  }
  
  /**
   * Met à jour la quantité d'un élément du panier
   */
  async updateQuantity(cartItemId: string, quantity: number): Promise<CartItem | null> {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity, updated_at: new Date().toISOString() })
      .eq('id', cartItemId)
      .select(`
        *,
        shop_items (
          id,
          name,
          price,
          image_url
        ),
        shop: shop_items(shop (
          id,
          name
        ))
      `)
      .single();
    
    if (error) {
      console.error('Erreur lors de la mise à jour de la quantité:', error);
      throw error;
    }
    
    return data as CartItem;
  }
  
  /**
   * Supprime un élément du panier
   */
  async removeFromCart(cartItemId: string): Promise<void> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);
    
    if (error) {
      console.error('Erreur lors de la suppression du panier:', error);
      throw error;
    }
  }
  
  /**
   * Vide le panier d'un utilisateur
   */
  async clearCart(userId: string): Promise<void> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);
    
    if (error) {
      console.error('Erreur lors du vidage du panier:', error);
      throw error;
    }
  }
  
  /**
   * Compte le nombre d'éléments dans le panier
   */
  async getCartCount(userId: string): Promise<number> {
    if (!userId) return 0;
    
    const { count, error } = await supabase
      .from('cart_items')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    if (error) {
      console.error('Erreur lors du comptage du panier:', error);
      throw error;
    }
    
    return count || 0;
  }
}

export const cartRepository = new CartRepository();
