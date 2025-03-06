
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useShop } from "@/hooks/useShop";
import { ShopReview } from "@/core/shop/domain/types";

interface ShopReviewsListProps {
  shopId: string;
}

export function ShopReviewsList({ shopId }: ShopReviewsListProps) {
  const { getShopReviews } = useShop();
  const reviewsQuery = getShopReviews(shopId);
  const [reviews, setReviews] = useState<ShopReview[]>([]);

  useEffect(() => {
    if (reviewsQuery.data) {
      setReviews(reviewsQuery.data);
    }
  }, [reviewsQuery.data]);

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <span key={i} className={i < rating ? "text-yellow-500" : "text-gray-300"}>
          ★
        </span>
      ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avis clients</CardTitle>
      </CardHeader>
      <CardContent>
        {reviewsQuery.isLoading ? (
          <div>Chargement des avis...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            Aucun avis pour le moment
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-4 last:border-0">
                <div className="flex justify-between items-center">
                  <div className="font-medium">
                    {review.profiles?.username || "Utilisateur inconnu"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="my-1">{renderStars(review.rating)}</div>
                {review.comment && <p className="text-gray-700">{review.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
