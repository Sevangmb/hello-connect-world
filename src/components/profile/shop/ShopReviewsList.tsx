import React, { useEffect, useState } from 'react';
import { useShop } from '@/hooks/useShop';
import { ShopReview } from '@/core/shop/domain/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { StarIcon } from 'lucide-react';

interface ShopReviewsListProps {
  shopId: string;
}

export const ShopReviewsList: React.FC<ShopReviewsListProps> = ({ shopId }) => {
  const [reviews, setReviews] = useState<ShopReview[]>([]);
  const [loading, setLoading] = useState(true);
  const { getShopReviews } = useShop();

  useEffect(() => {
    const loadReviews = async () => {
      if (!shopId) return;
      setLoading(true);
      try {
        const shopReviews = await getShopReviews(shopId);
        setReviews(shopReviews || []);
      } catch (error) {
        console.error('Error loading shop reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [shopId, getShopReviews]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <StarIcon 
            key={i} 
            className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gray-200"></div>
              <div className="space-y-2">
                <div className="h-4 w-40 bg-gray-200 rounded"></div>
                <div className="h-3 w-24 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="mt-2 h-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="py-4 text-center text-muted-foreground">
          Aucun avis pour le moment.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback>
                    {(review.profiles?.username || 'U').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{review.profiles?.username || 'Utilisateur'}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {renderStars(review.rating)}
            </div>
            {review.comment && (
              <p className="text-sm mt-2">{review.comment}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
