
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import { useShop } from "@/hooks/useShop";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { ShopReview } from "@/core/shop/domain/types";

interface ShopReviewsListProps {
  shopId: string;
}

export function ShopReviewsList({ shopId }: ShopReviewsListProps) {
  const { useShopReviews } = useShop(null);
  const { data: reviews, isLoading } = useShopReviews(shopId);
  const [activeFilter, setActiveFilter] = useState<number | null>(null);

  const filteredReviews = activeFilter
    ? reviews?.filter(review => review.rating === activeFilter)
    : reviews;

  const countByRating = {
    5: reviews?.filter(r => r.rating === 5).length || 0,
    4: reviews?.filter(r => r.rating === 4).length || 0,
    3: reviews?.filter(r => r.rating === 3).length || 0,
    2: reviews?.filter(r => r.rating === 2).length || 0,
    1: reviews?.filter(r => r.rating === 1).length || 0,
  };

  const totalReviews = reviews?.length || 0;
  const averageRating = totalReviews
    ? reviews?.reduce((sum, review) => sum + review.rating, 0) / totalReviews
    : 0;

  // Helper to render the stars
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      i < rating 
        ? <StarFilledIcon key={i} className="h-4 w-4 text-yellow-400" />
        : <StarIcon key={i} className="h-4 w-4 text-gray-300" />
    ));
  };

  if (isLoading) {
    return <div>Chargement des avis...</div>;
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucun avis pour cette boutique.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center space-x-4">
          <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
          <div className="flex-1">
            <div className="flex space-x-1 mb-1">
              {renderStars(Math.round(averageRating))}
            </div>
            <div className="text-sm text-muted-foreground">
              {totalReviews} avis au total
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <Button 
            variant={activeFilter === null ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(null)}
          >
            Tous ({totalReviews})
          </Button>
          {[5, 4, 3, 2, 1].map(rating => (
            <Button
              key={rating}
              variant={activeFilter === rating ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(activeFilter === rating ? null : rating)}
              disabled={countByRating[rating as keyof typeof countByRating] === 0}
            >
              {rating} {rating === 1 ? 'étoile' : 'étoiles'} ({countByRating[rating as keyof typeof countByRating]})
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredReviews?.map((review: ShopReview) => (
          <Card key={review.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex space-x-1 mb-2">
                    {renderStars(review.rating)}
                  </div>
                  <h4 className="font-medium">
                    {review.profiles?.username || review.profiles?.full_name || "Utilisateur"}
                  </h4>
                  <div className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(review.created_at), { addSuffix: true, locale: fr })}
                  </div>
                </div>
                {review.rating >= 4 && (
                  <Badge className="bg-green-100 text-green-800">Recommandé</Badge>
                )}
              </div>
              
              {review.comment && (
                <div className="mt-3 text-gray-700">
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
