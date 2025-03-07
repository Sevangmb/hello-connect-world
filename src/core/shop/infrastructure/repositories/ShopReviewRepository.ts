
import { supabase } from '@/integrations/supabase/client';
import { ShopReview, mapShopReview, mapShopReviews } from '../../domain/types';

export class ShopReviewRepository {
  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    const { data, error } = await supabase
      .from('shop_reviews')
      .select('*, profiles:user_id(username, full_name)')
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching shop reviews:', error);
      return [];
    }

    return mapShopReviews(data || []);
  }
  
  async addShopReview(review: { shop_id: string; user_id: string; rating: number; comment?: string }): Promise<ShopReview | null> {
    const { data, error } = await supabase
      .from('shop_reviews')
      .insert({
        shop_id: review.shop_id,
        user_id: review.user_id,
        rating: review.rating,
        comment: review.comment,
      })
      .select('*, profiles:user_id(username, full_name)')
      .single();

    if (error) {
      console.error('Error adding shop review:', error);
      return null;
    }

    return mapShopReview(data);
  }

  async updateShopReview(id: string, updates: Partial<ShopReview>): Promise<ShopReview | null> {
    const { data, error } = await supabase
      .from('shop_reviews')
      .update({
        rating: updates.rating,
        comment: updates.comment,
      })
      .eq('id', id)
      .select('*, profiles:user_id(username, full_name)')
      .single();

    if (error) {
      console.error('Error updating shop review:', error);
      return null;
    }

    return mapShopReview(data);
  }

  async deleteShopReview(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('shop_reviews')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting shop review:', error);
      return false;
    }

    return true;
  }
}
