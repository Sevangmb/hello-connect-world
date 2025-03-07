
import { supabase } from '@/integrations/supabase/client';
import { IShopReviewRepository } from '../../domain/interfaces/IShopReviewRepository';
import { ShopReview } from '../../domain/types';

/**
 * Implémentation du repository pour les avis de boutique
 */
export class ShopReviewRepository implements IShopReviewRepository {
  /**
   * Récupère les avis d'une boutique
   */
  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .select(`
          *,
          profiles:user_id (
            username,
            full_name
          )
        `)
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error(`Error fetching reviews for shop ${shopId}:`, error);
        return [];
      }
      
      return data as ShopReview[];
    } catch (error) {
      console.error(`Error in getShopReviews for ${shopId}:`, error);
      return [];
    }
  }
  
  /**
   * Ajoute un avis pour une boutique
   */
  async addShopReview(review: { shop_id: string; user_id: string; rating: number; comment?: string }): Promise<ShopReview | null> {
    try {
      // Validation - s'assurer que les champs requis sont présents
      if (!review.shop_id || !review.user_id || review.rating === undefined) {
        console.error('Required fields missing for shop review');
        return null;
      }
      
      const insertData = {
        shop_id: review.shop_id,
        user_id: review.user_id,
        rating: review.rating,
        comment: review.comment,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('shop_reviews')
        .insert(insertData)
        .select(`
          *,
          profiles:user_id (
            username,
            full_name
          )
        `)
        .single();
      
      if (error) {
        console.error('Error adding shop review:', error);
        return null;
      }
      
      return data as ShopReview;
    } catch (error) {
      console.error('Error in addShopReview:', error);
      return null;
    }
  }
  
  /**
   * Met à jour un avis
   */
  async updateShopReview(reviewId: string, updates: Partial<ShopReview>): Promise<ShopReview | null> {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      // Validation de la note
      if (updates.rating !== undefined && (updates.rating < 1 || updates.rating > 5)) {
        console.error(`Invalid rating value: ${updates.rating}`);
        return null;
      }
      
      const { data, error } = await supabase
        .from('shop_reviews')
        .update(updateData)
        .eq('id', reviewId)
        .select(`
          *,
          profiles:user_id (
            username,
            full_name
          )
        `)
        .single();
      
      if (error) {
        console.error(`Error updating shop review ${reviewId}:`, error);
        return null;
      }
      
      return data as ShopReview;
    } catch (error) {
      console.error(`Error in updateShopReview for ${reviewId}:`, error);
      return null;
    }
  }
  
  /**
   * Supprime un avis
   */
  async deleteShopReview(reviewId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shop_reviews')
        .delete()
        .eq('id', reviewId);
      
      if (error) {
        console.error(`Error deleting shop review ${reviewId}:`, error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error(`Error in deleteShopReview for ${reviewId}:`, error);
      return false;
    }
  }
}
