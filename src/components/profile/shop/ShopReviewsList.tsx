
import React, { useEffect, useState } from 'react';
import { useShop } from '@/hooks/useShop';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ShopReview } from '@/core/shop/domain/types';

interface ShopReviewsListProps {
  shopId: string;
}

export function ShopReviewsList({ shopId }: ShopReviewsListProps) {
  const { getShopReviews } = useShop();
  const [reviews, setReviews] = useState<ShopReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      if (shopId) {
        setIsLoading(true);
        try {
          const shopReviews = await getShopReviews(shopId);
          setReviews(shopReviews || []);
        } catch (error) {
          console.error('Error loading shop reviews:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadReviews();
  }, [shopId, getShopReviews]);

  if (isLoading) {
    return <div>Chargement des avis...</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md">
        <p className="text-lg mb-4">Aucun avis pour l'instant</p>
        <p className="text-muted-foreground">
          Les avis de vos clients s'afficheront ici.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Avis Clients ({reviews.length})</h2>
        <div className="text-sm text-muted-foreground">
          Note moyenne: {reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length} / 5
        </div>
      </div>

      {reviews.map((review) => (
        <Card key={review.id}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarFallback>{review.profiles?.username?.substring(0, 2) || 'U'}</AvatarFallback>
                <AvatarImage src={`/avatars/${review.user_id}.png`} />
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{review.profiles?.full_name || review.profiles?.username || 'Utilisateur'}</p>
                    <p className="text-sm text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < review.rating ? "text-yellow-500" : "text-gray-300"}>★</span>
                    ))}
                  </div>
                </div>
                <p className="mt-2">{review.comment || "Aucun commentaire"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
