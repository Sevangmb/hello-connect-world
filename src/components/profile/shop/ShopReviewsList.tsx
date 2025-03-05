
import React from 'react';
import { useShop } from '@/hooks/useShop';
import { ShopReview } from '@/core/shop/domain/types';

export interface ShopReviewsListProps {
  shopId: string;
}

export default function ShopReviewsList({ shopId }: ShopReviewsListProps) {
  const [reviews, setReviews] = React.useState<ShopReview[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Mock implementation for the shop hooks
  const getShopReviews = async (shopId: string) => {
    // Mock implementation
    return [] as ShopReview[];
  };

  React.useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const data = await getShopReviews(shopId);
        setReviews(data);
      } catch (err) {
        setError('Failed to load shop reviews');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [shopId]);

  if (loading) {
    return <div>Loading shop reviews...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (reviews.length === 0) {
    return <div>No reviews found for this shop.</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Shop Reviews</h3>
      <div className="grid gap-4">
        {reviews.map((review) => (
          <div key={review.id} className="border rounded-md p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-2">
                  {/* Avatar placeholder */}
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    {review.profiles?.username?.[0] || "U"}
                  </div>
                </div>
                <div>
                  <span className="font-medium">
                    {review.profiles?.username || "Anonymous"}
                  </span>
                  <div className="flex text-yellow-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>
                        {i < review.rating ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(review.created_at).toLocaleDateString()}
              </span>
            </div>
            {review.comment && (
              <p className="mt-2 text-gray-700">{review.comment}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Fix for correct imports in parent files
export { default as ShopReviewsList } from './ShopReviewsList';
