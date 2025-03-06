
import React from 'react';
import { useShop } from '@/hooks/useShop';
import { ShopReview } from '@/core/shop/domain/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';

export const ShopReviewsList: React.FC = () => {
  const { shop, shopService } = useShop();
  
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['shop-reviews', shop?.id],
    queryFn: () => shopService.getShopReviews(shop?.id || ''),
    enabled: !!shop?.id
  });

  if (isLoading) {
    return <ReviewsLoadingSkeleton />;
  }

  if (!reviews || reviews.length === 0) {
    return <NoReviewsMessage />;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Avis des clients</h2>
      
      <div className="grid gap-4 md:grid-cols-2">
        {reviews.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
};

const ReviewCard: React.FC<{ review: ShopReview }> = ({ review }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const ratingStars = Array(5).fill(0).map((_, i) => (
    <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"}>
      ★
    </span>
  ));

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarFallback>
                {review.profiles?.username?.charAt(0) || review.user_id.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-sm font-medium">
                {review.profiles?.username || 'Utilisateur anonyme'}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {formatDate(review.created_at)}
              </p>
            </div>
          </div>
          <div className="flex text-lg">{ratingStars}</div>
        </div>
      </CardHeader>
      <CardContent>
        {review.comment ? (
          <p className="text-sm">{review.comment}</p>
        ) : (
          <p className="text-sm text-muted-foreground italic">Aucun commentaire</p>
        )}
      </CardContent>
    </Card>
  );
};

const NoReviewsMessage: React.FC = () => (
  <div className="text-center py-10">
    <h3 className="text-lg font-medium">Aucun avis pour le moment</h3>
    <p className="text-muted-foreground mt-2">
      Les avis des clients apparaîtront ici lorsque vous en recevrez.
    </p>
  </div>
);

const ReviewsLoadingSkeleton: React.FC = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-48" />
    <div className="grid gap-4 md:grid-cols-2">
      {[1, 2, 3, 4].map(i => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16 mt-1" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);
