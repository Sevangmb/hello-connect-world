
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { shopService } from '@/core/shop/infrastructure/ShopServiceProvider';
import { ShopReview } from '@/core/shop/domain/types';

interface ShopReviewsListProps {
  shopId: string;
}

export function ShopReviewsList({ shopId }: ShopReviewsListProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<ShopReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        if (shopId) {
          const shopReviews = await shopService.getShopReviews(shopId);
          setReviews(shopReviews);
        }
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les avis",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [shopId, toast]);

  if (loading) {
    return <div>Chargement des avis...</div>;
  }

  if (!reviews.length) {
    return <div>Aucun avis pour le moment.</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Avis des clients ({reviews.length})</h3>
      
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white p-4 rounded-md shadow">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">
                  {review.profiles?.username || "Utilisateur anonyme"}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(review.created_at).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                <span className="font-bold">{review.rating}/5</span>
              </div>
            </div>
            
            {review.comment && (
              <div className="mt-2 text-gray-700">{review.comment}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
