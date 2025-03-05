
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, User } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useShop } from '@/hooks/useShop';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function ShopReviewsList() {
  const { reviews, loading, shop } = useShop();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg bg-gray-50">
        <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Star className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium">Aucun avis</h3>
        <p className="text-muted-foreground mt-1">
          Votre boutique n'a pas encore reçu d'avis.
        </p>
      </div>
    );
  }
  
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Avis clients</h3>
          <p className="text-muted-foreground text-sm">
            Note moyenne : {shop?.average_rating || 0} / 5 ({reviews.length} avis)
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={review.profiles?.avatar_url || undefined} alt="Avatar" />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {review.profiles?.username || review.profiles?.full_name || "Utilisateur anonyme"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(review.created_at), 'dd MMMM yyyy', { locale: fr })}
                    </div>
                  </div>
                </div>
                <div>
                  {renderStars(review.rating)}
                </div>
              </div>
              
              {review.comment && (
                <div className="mt-3 text-sm">
                  {review.comment}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
