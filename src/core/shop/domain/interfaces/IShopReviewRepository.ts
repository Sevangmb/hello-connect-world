
import { ShopReview } from '../types';

export interface IShopReviewRepository {
  /**
   * Récupère les avis d'une boutique
   */
  getShopReviews(shopId: string): Promise<ShopReview[]>;
  
  /**
   * Ajoute un avis pour une boutique
   */
  addShopReview(review: { shop_id: string; user_id: string; rating: number; comment?: string }): Promise<ShopReview | null>;
  
  /**
   * Met à jour un avis
   */
  updateShopReview(reviewId: string, updates: Partial<ShopReview>): Promise<ShopReview | null>;
  
  /**
   * Supprime un avis
   */
  deleteShopReview(reviewId: string): Promise<boolean>;
}
