
import React, { useEffect } from 'react';
import { useShop } from '@/hooks/useShop';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUserShop } from '@/hooks/useShop';
import ShopReviewsList from './ShopReviewsList';
import { ShopItemsList } from './ShopItemsList';
import { ShopSettings } from './ShopSettings';
import { useToast } from '@/hooks/use-toast';

export const ShopDashboard = () => {
  const { userShop, loading, error, fetchUserShop } = useUserShop();
  const { toast } = useToast();

  useEffect(() => {
    fetchUserShop();
  }, [fetchUserShop]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load shop data',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!userShop) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Create Your Shop</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">You don't have a shop yet. Create one to start selling your items.</p>
            <Link to="/create-shop">
              <Button>Create Shop</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">{userShop.name}</h1>
          <p className="text-muted-foreground">{userShop.description}</p>
        </div>
        
        <div className="flex gap-2 mt-4 md:mt-0">
          <Link to={`/shops/${userShop.id}`}>
            <Button variant="outline">View Public Page</Button>
          </Link>
          <Link to="/add-shop-item">
            <Button>Add Item</Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="items">
        <TabsList className="mb-4">
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="items">
          <ShopItemsList shopId={userShop.id} />
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Shop Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <ShopReviewsList shopId={userShop.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <ShopSettings shopId={userShop.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
