
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getShopService } from '@/core/shop/infrastructure/ShopServiceProvider';
import { ShopReview } from '@/core/shop/domain/types';
import { format } from 'date-fns';
import { Star } from 'lucide-react';

interface ShopReviewsListProps {
  shopId: string;
}

const ShopReviewsList: React.FC<ShopReviewsListProps> = ({ shopId }) => {
  const { data: reviews, isLoading, error } = useQuery({
    queryKey: ['shopReviews', shopId],
    queryFn: async () => {
      const shopService = getShopService();
      return shopService.getShopReviews(shopId);
    }
  });

  if (isLoading) {
    return <div>Chargement des avis...</div>;
  }

  if (error) {
    return <div>Erreur: {(error as Error).message}</div>;
  }

  if (!reviews || reviews.length === 0) {
    return <div>Aucun avis pour cette boutique.</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Avis clients ({reviews.length})</h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h3 className="font-medium">
                  {review.profiles?.full_name || review.profiles?.username || 'Utilisateur'}
                </h3>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {format(new Date(review.created_at), 'dd/MM/yyyy')}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{review.comment || 'Pas de commentaire'}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ShopReviewsList;
