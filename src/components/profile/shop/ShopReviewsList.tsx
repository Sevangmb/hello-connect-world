
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
  const { fetchShopById } = useShop();
  const [reviews, setReviews] = useState<ShopReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        
        // For now, we'll just use some dummy data since getShopReviews isn't implemented
        // In a real implementation, you'd fetch this from the API
        const dummyReviews = [
          {
            id: '1',
            shop_id: shopId,
            user_id: 'user1',
            rating: 5,
            comment: 'Excellent service and products!',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            profiles: {
              username: 'john_doe',
              full_name: 'John Doe'
            }
          },
          {
            id: '2',
            shop_id: shopId,
            user_id: 'user2',
            rating: 4,
            comment: 'Great shop, would buy again.',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            profiles: {
              username: 'jane_smith',
              full_name: 'Jane Smith'
            }
          }
        ] as ShopReview[];
        
        setReviews(dummyReviews);
      } catch (error) {
        console.error('Error fetching shop reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [shopId, fetchShopById]);

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
