
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { useShop } from '@/hooks/useShop';

interface ShopReviewsListProps {
  shopId: string;
}

export function ShopReviewsList({ shopId }: ShopReviewsListProps) {
  const { getShopReviews } = useShop(null);
  const { data: reviews, isLoading, error } = getShopReviews(shopId);
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        Erreur lors du chargement des avis: {error.message}
      </div>
    );
  }
  
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Aucun avis pour le moment.
      </div>
    );
  }
  
  // Calculer la moyenne des notes
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  
  const RatingStars = ({ rating }: { rating: number }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium">Avis clients</h3>
          <div className="flex items-center mt-1">
            <RatingStars rating={Math.round(averageRating)} />
            <span className="ml-2 text-sm">
              {averageRating.toFixed(1)} sur 5 ({reviews.length} avis)
            </span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-4">
              <div className="flex justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {review.profiles?.username?.charAt(0) || 'U'}
                    </AvatarFallback>
                    {/* Ajoutez AvatarImage si vous avez des images de profil */}
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{review.profiles?.full_name || review.profiles?.username || 'Utilisateur'}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <RatingStars rating={review.rating} />
              </div>
              
              {review.comment && (
                <p className="mt-3 text-sm">{review.comment}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
