
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

import ShopItemsList from "./ShopItemsList";
import ShopOrdersList from "./ShopOrdersList";
import ShopReviewsList from "./ShopReviewsList";
import AddItemForm from "./AddItemForm";
import CreateShopForm from "./CreateShopForm";
import ShopSettings from "@/components/profile/shop/ShopSettings";

import { useShop } from '@/hooks/useShop';
import { Shop, ShopStatus } from '@/core/shop/domain/types';

const ShopDashboard = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const { shop, isShopLoading, refetchShop, updateShopStatus } = useShop();
  const [activeTab, setActiveTab] = useState('items');
  const [isOwner, setIsOwner] = useState(false);
  const { toast } = useToast();

  // Handle shop status change
  const handleStatusChange = (status: ShopStatus) => {
    if (!shop) return;
    
    updateShopStatus.mutate(
      { id: shop.id, status },
      {
        onSuccess: () => {
          toast({
            title: "Shop status updated",
            description: `Your shop is now ${status}`,
          });
          refetchShop();
        },
        onError: (error) => {
          toast({
            title: "Failed to update shop status",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    );
  };

  // Check ownership
  useEffect(() => {
    if (shop) {
      setIsOwner(true); // Simplified for now
    }
  }, [shop]);

  if (isShopLoading) {
    return <div className="container py-8">Loading shop details...</div>;
  }

  if (!shop) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Shop Not Found</AlertTitle>
        <AlertDescription>
          The shop you're looking for doesn't exist or you don't have permission to view it.
        </AlertDescription>
      </Alert>
    );
  }

  // Show creation form if user doesn't have a shop
  if (!shop.id) {
    return (
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Create Your Shop</CardTitle>
            <CardDescription>Set up your own shop to start selling items</CardDescription>
          </CardHeader>
          <CardContent>
            <CreateShopForm />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Shop exists but is pending approval
  if (shop.status === 'pending') {
    return (
      <Alert>
        <AlertTitle>Your Shop is Pending Approval</AlertTitle>
        <AlertDescription>
          Your shop has been created and is waiting for administrator approval.
          You'll be notified once it's approved.
        </AlertDescription>
      </Alert>
    );
  }

  // Shop is rejected
  if (shop.status === 'rejected') {
    return (
      <Alert variant="destructive">
        <AlertTitle>Your Shop Registration was Rejected</AlertTitle>
        <AlertDescription>
          Unfortunately, your shop registration was not approved. Please contact support for more details.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{shop.name}</h1>
        <p className="text-muted-foreground mb-4">{shop.description}</p>
        
        {isOwner && (
          <div className="flex gap-2 mt-4">
            {shop.status === 'approved' && (
              <Button 
                variant="outline" 
                onClick={() => handleStatusChange('suspended')}
              >
                Temporarily Close Shop
              </Button>
            )}
            
            {shop.status === 'suspended' && (
              <Button 
                variant="default" 
                onClick={() => handleStatusChange('approved')}
              >
                Reopen Shop
              </Button>
            )}
          </div>
        )}
      </div>

      {isOwner && (
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="items" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Your Items</h2>
              <Button>Add New Item</Button>
            </div>
            <ShopItemsList shopId={shop.id} />
          </TabsContent>
          
          <TabsContent value="orders">
            <h2 className="text-xl font-bold mb-4">Your Orders</h2>
            <ShopOrdersList shopId={shop.id} />
          </TabsContent>
          
          <TabsContent value="reviews">
            <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
            <ShopReviewsList shopId={shop.id} />
          </TabsContent>
          
          <TabsContent value="settings">
            <h2 className="text-xl font-bold mb-4">Shop Settings</h2>
            <ShopSettings shopId={shop.id} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ShopDashboard;
