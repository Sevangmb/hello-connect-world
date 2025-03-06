
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useShop } from '@/hooks/useShop';
import { ShopReview } from '@/core/shop/domain/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function ShopReviewsList({ shopId }: { shopId: string }) {
  const { getShopReviews } = useShop();
  const { data: reviewsData, isLoading } = getShopReviews(shopId);
  const [reviews, setReviews] = useState<ShopReview[]>([]);
  
  useEffect(() => {
    if (reviewsData) {
      setReviews(reviewsData);
    }
  }, [reviewsData]);
  
  if (isLoading) {
    return <div>Chargement des avis...</div>;
  }
  
  if (reviews.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">Aucun avis pour le moment</h3>
        <p className="text-gray-500 mt-2">Les avis de vos clients apparaîtront ici</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Avis clients ({reviews.length})</h2>
      
      {reviews.map(review => (
        <Card key={review.id} className="p-4">
          <div className="flex items-start gap-4">
            <Avatar className="w-10 h-10">
              <div className="bg-primary text-primary-foreground rounded-full w-full h-full flex items-center justify-center">
                {(review.profiles?.username || 'A')[0].toUpperCase()}
              </div>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">
                    {review.profiles?.username || review.profiles?.full_name || 'Anonyme'}
                  </h3>
                  <div className="text-sm text-gray-500">
                    {format(new Date(review.created_at), 'dd MMMM yyyy', { locale: fr })}
                  </div>
                </div>
                
                <Badge variant={getRatingVariant(review.rating)}>
                  {review.rating}/5
                </Badge>
              </div>
              
              {review.comment && (
                <p className="mt-2 text-gray-700">{review.comment}</p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function getRatingVariant(rating: number): 'default' | 'destructive' | 'outline' | 'secondary' {
  if (rating >= 4) return 'default';
  if (rating >= 3) return 'secondary';
  if (rating >= 2) return 'outline';
  return 'destructive';
}
