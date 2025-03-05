
import { useState, useEffect } from 'react';
import { useShop } from '@/hooks/useShop';
import { ShopReview } from '@/core/shop/domain/types';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { format } from 'date-fns';

interface ShopReviewsListProps {
  shopId: string;
}

export function ShopReviewsList({ shopId }: ShopReviewsListProps) {
  const { getShopReviews } = useShop();
  const [reviews, setReviews] = useState<ShopReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const shopReviews = await getShopReviews(shopId);
        setReviews(shopReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    if (shopId) {
      fetchReviews();
    }
  }, [shopId, getShopReviews]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">Aucun avis pour cette boutique</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-4">
        <div className="flex-1">
          <div className="text-2xl font-bold">
            {(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)}
          </div>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => {
              const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
              return (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                  }`}
                />
              );
            })}
          </div>
          <div className="text-sm text-muted-foreground">
            {reviews.length} avis
          </div>
        </div>
        <div className="space-y-1">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = reviews.filter(review => review.rating === rating).length;
            const percentage = (count / reviews.length) * 100;
            return (
              <div key={rating} className="flex items-center">
                <span className="text-sm w-3">{rating}</span>
                <Star className="h-3 w-3 ml-1 text-yellow-400" />
                <div className="w-32 h-2 bg-gray-200 rounded-full ml-2">
                  <div
                    className="h-2 bg-yellow-400 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-xs ml-2">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-4">
              <div className="flex justify-between mb-2">
                <div className="flex items-center">
                  <div className="font-medium">
                    {review.profiles?.username || review.profiles?.full_name || 'Utilisateur anonyme'}
                  </div>
                  <div className="text-xs text-muted-foreground ml-2">
                    {format(new Date(review.created_at), 'dd/MM/yyyy')}
                  </div>
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              {review.comment && (
                <p className="text-sm">{review.comment}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
