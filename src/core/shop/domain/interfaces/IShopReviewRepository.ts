
import { ShopReview } from '../types';

export interface IShopReviewRepository {
  getShopReviews(shopId: string): Promise<ShopReview[]>;
  addShopReview(review: { shop_id: string; user_id: string; rating: number; comment?: string }): Promise<ShopReview | null>;
  updateShopReview(id: string, updates: Partial<ShopReview>): Promise<ShopReview | null>;
  deleteShopReview(id: string): Promise<boolean>;
}
