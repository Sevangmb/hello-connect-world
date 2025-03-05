import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Star } from 'lucide-react';

import { useShop } from '@/hooks/useShop';
import { ShopReview } from '@/core/shop/domain/types';

const ShopReviewsList = ({ shopId }: { shopId: string }) => {
  const { getShopReviews } = useShop();
  const [reviews, setReviews] = useState<ShopReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        const fetchedReviews = await getShopReviews(shopId);
        setReviews(fetchedReviews || []);
      } catch (error) {
        console.error("Failed to fetch shop reviews:", error);
        setReviews([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [shopId, getShopReviews]);

  if (isLoading) {
    return <div className="text-center py-4">Loading reviews...</div>;
  }

  if (!reviews || reviews.length === 0) {
    return <div className="text-center py-4">No reviews available for this shop.</div>;
  }

  return (
    <div>
      {reviews.map((review) => (
        <Card key={review.id} className="mb-4">
          <CardHeader className="flex flex-row items-center space-x-4">
            <Avatar>
              {review.profiles?.username ? (
                <AvatarImage src={`https://avatar.vercel.sh/${review.profiles.username}.png`} alt={review.profiles.username} />
              ) : (
                <AvatarFallback>{review.profiles?.full_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-sm font-medium">{review.profiles?.full_name || 'Anonymous'}</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {review.created_at}
              </CardDescription>
            </div>
            <div className="flex items-center">
              {[...Array(review.rating)].map((_, index) => (
                <Star key={index} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">{review.comment || 'No comment provided.'}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ShopReviewsList;
