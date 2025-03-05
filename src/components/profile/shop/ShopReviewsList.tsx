
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { ShopReview } from '@/core/shop/domain/types';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Updated interface to include limit
export interface ShopReviewsListProps {
  shopId: string;
  limit?: number;
}

const ShopReviewsList: React.FC<ShopReviewsListProps> = ({ shopId, limit }) => {
  const [reviews, setReviews] = useState<ShopReview[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load shop reviews
  const loadReviews = async () => {
    try {
      setLoading(true);
      // Get shop reviews (this would be implemented in a real hook)
      // const data = await getShopReviews(shopId);
      const data: ShopReview[] = []; // Placeholder for real data
      
      // Apply limit if provided
      if (limit && data.length > limit) {
        setReviews(data.slice(0, limit));
      } else {
        setReviews(data);
      }
    } catch (error) {
      console.error('Error loading shop reviews:', error);
      toast({
        variant: "destructive",
        title: "Error loading reviews",
        description: "There was a problem loading the shop reviews."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [shopId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <MessageCircle className="h-10 w-10 text-gray-400 mb-2" />
            <h3 className="text-lg font-medium text-gray-900">No reviews yet</h3>
            <p className="text-sm text-gray-500 mt-1">
              Be the first to review this shop!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews {limit && reviews.length >= limit && '(Limited View)'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="flex items-start space-x-3 border-b pb-4">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback>
                  {review.profiles?.username?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">
                    {review.profiles?.full_name || review.profiles?.username || 'User'}
                  </h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={
                        i < review.rating 
                          ? "text-yellow-500" 
                          : "text-gray-300"
                      }>★</span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {review.comment || 'No comment provided.'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {limit && reviews.length >= limit && (
          <div className="mt-4 text-center">
            <Button variant="outline" onClick={() => {/* View all reviews */}}>
              View All Reviews
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShopReviewsList;
