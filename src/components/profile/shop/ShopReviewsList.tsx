
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useShop } from '@/hooks/useShop';
import { Loader2, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ShopReview } from '@/core/shop/domain/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ShopReviewsListProps {
  shopId: string;
}

export function ShopReviewsList({ shopId }: ShopReviewsListProps) {
  const { getShopReviews } = useShop(shopId);
  const { toast } = useToast();
  const [reviews, setReviews] = useState<ShopReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true);
      try {
        const items = await getShopReviews(shopId);
        setReviews(items);
      } catch (error) {
        console.error('Error loading shop reviews:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les avis. Veuillez réessayer.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [shopId, getShopReviews, toast]);

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">Aucun avis</h3>
        <p className="text-muted-foreground">
          Cette boutique n'a pas encore reçu d'avis.
        </p>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-0">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarFallback>
                    {review.profiles?.username ? review.profiles.username.substring(0, 2).toUpperCase() : 'UN'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium">
                      {review.profiles?.username || 'Utilisateur anonyme'}
                    </h4>
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Le {new Date(review.created_at).toLocaleDateString()}
                  </p>
                  {review.comment && (
                    <p className="text-sm">{review.comment}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
