
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shop, ShopStatus } from '@/core/shop/domain/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import ShopItemsList from './ShopItemsList';
import ShopOrdersList from './ShopOrdersList';
import ShopReviewsList from './ShopReviewsList';
import ShopSettings from './ShopSettings';
import { AlertTriangle, CheckCircle, Clock, ShoppingBag, Star, Settings, Package, Ban } from 'lucide-react';

interface ShopDashboardProps {
  shop: Shop;
  isCurrentUserShopOwner: boolean;
}

const ShopDashboard: React.FC<ShopDashboardProps> = ({ 
  shop, 
  isCurrentUserShopOwner 
}) => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const { toast } = useToast();

  const getStatusBadge = (status: ShopStatus) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Active</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending Approval</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleStatusUpdate = async (newStatus: ShopStatus) => {
    if (newStatus === 'suspended' && !confirm('Are you sure you want to suspend your shop? It will no longer be visible to customers.')) {
      return;
    }
    
    setIsUpdatingStatus(true);
    try {
      // This would be implemented in a real hook
      // await updateShopStatus.mutateAsync({
      //   id: shop.id,
      //   status: newStatus
      // });
      
      toast({
        title: 'Shop Status Updated',
        description: `Your shop is now ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating shop status:', error);
      toast({
        variant: "destructive",
        title: "Error updating status",
        description: "There was a problem updating your shop status."
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (shop.status === 'suspended') {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700">{shop.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <Ban className="h-4 w-4" />
            <AlertTitle>Shop Suspended</AlertTitle>
            <AlertDescription>
              Your shop has been suspended and is not visible to customers.
            </AlertDescription>
          </Alert>
          
          {isCurrentUserShopOwner && (
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={() => handleStatusUpdate('pending')}
                disabled={isUpdatingStatus}
              >
                Request Reactivation
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (shop.status === 'rejected') {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700">{shop.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Shop Rejected</AlertTitle>
            <AlertDescription>
              Your shop application has been rejected. Please update your shop information and reapply.
            </AlertDescription>
          </Alert>
          
          {isCurrentUserShopOwner && (
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={() => handleStatusUpdate('pending')}
                disabled={isUpdatingStatus}
              >
                Reapply
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (shop.status === 'pending') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{shop.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4 border-yellow-200 bg-yellow-50">
            <Clock className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800">Shop Pending Approval</AlertTitle>
            <AlertDescription className="text-yellow-800">
              Your shop is currently being reviewed by our team. This usually takes 1-2 business days.
            </AlertDescription>
          </Alert>
          
          {isCurrentUserShopOwner && (
            <Tabs defaultValue="information">
              <TabsList className="mb-4">
                <TabsTrigger value="information">Information</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="information">
                <Card>
                  <CardContent className="pt-6">
                    <ShopSettings shop={shop} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings">
                <Card>
                  <CardContent className="pt-6">
                    <ShopSettings shop={shop} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>{shop.name}</CardTitle>
            {getStatusBadge(shop.status)}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 mb-4">{shop.description}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 flex items-center">
                <ShoppingBag className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Total Items</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center">
                <Package className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center">
                <Star className="h-8 w-8 text-yellow-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Rating</p>
                  <p className="text-2xl font-bold">{shop.average_rating.toFixed(1)}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center">
                <CheckCircle className="h-8 w-8 text-purple-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="text-2xl font-bold capitalize">{shop.status}</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {isCurrentUserShopOwner && (
            <Tabs defaultValue="items">
              <TabsList className="mb-4">
                <TabsTrigger value="items">Items</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="items">
                <ShopItemsList shopId={shop.id} isOwner={true} />
              </TabsContent>
              
              <TabsContent value="orders">
                <ShopOrdersList shopId={shop.id} />
              </TabsContent>
              
              <TabsContent value="reviews">
                <ShopReviewsList shopId={shop.id} />
              </TabsContent>
              
              <TabsContent value="settings">
                <ShopSettings shop={shop} />
              </TabsContent>
            </Tabs>
          )}
          
          {!isCurrentUserShopOwner && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ShopItemsList shopId={shop.id} isOwner={false} limit={6} />
              <ShopReviewsList shopId={shop.id} limit={5} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShopDashboard;
