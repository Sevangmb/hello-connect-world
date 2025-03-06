
import React, { useEffect, useState } from 'react';
import { useShop } from '@/hooks/useShop';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ShopReview } from '@/core/shop/domain/types';
import { Loader2, Star, StarOff } from 'lucide-react';

interface ShopReviewsListProps {
  shopId: string;
}

const ShopReviewsList: React.FC<ShopReviewsListProps> = ({ shopId }) => {
  const { getShopReviews } = useShop();
  const [reviews, setReviews] = useState<ShopReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const data = await getShopReviews(shopId);
        setReviews(data);
      } catch (error) {
        console.error('Error fetching shop reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [shopId, getShopReviews]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card className="text-center p-8">
        <CardHeader>
          <CardTitle>Aucun avis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Votre boutique n'a pas encore reçu d'avis.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Avis clients</h2>
      
      <div className="grid gap-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarFallback>
                    {review.profiles?.username?.substring(0, 2) || 'U'}
                  </AvatarFallback>
                  {review.profiles?.username && (
                    <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${review.profiles.username}`} />
                  )}
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {review.profiles?.full_name || review.profiles?.username || 'Utilisateur'}
                      </p>
                      <div className="flex items-center mt-1 text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          i < review.rating ? (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ) : (
                            <StarOff key={i} className="w-4 h-4" />
                          )
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {review.comment && (
                    <p className="mt-2 text-muted-foreground">{review.comment}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ShopReviewsList;
