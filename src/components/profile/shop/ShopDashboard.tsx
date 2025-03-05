
import React from 'react';
import { useShop } from '@/hooks/useShop';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ShopItemsList from './ShopItemsList';
import ShopOrdersList from './ShopOrdersList';
import ShopReviewsList from './ShopReviewsList';
import AddItemForm from './AddItemForm';
import CreateShopForm from './CreateShopForm';
import ShopSettings from './ShopSettings';
import { Button } from '@/components/ui/button';
import { Shop, ShopStatus } from '@/core/shop/domain/types';
import { useToast } from '@/hooks/use-toast';

export default function ShopDashboard() {
  const { shopId } = useParams<{ shopId: string }>();
  const { shop, isShopLoading, updateShopStatus } = useShop();
  const [activeTab, setActiveTab] = React.useState('items');
  const { toast } = useToast();
  const [isUpdatingStatus, setIsUpdatingStatus] = React.useState(false);

  // Check if current user is the shop owner
  const isCurrentUserShopOwner = true; // Mock value, in reality would check user ID

  const handleStatusUpdate = async (newStatus: ShopStatus) => {
    if (!shop) return;
    
    setIsUpdatingStatus(true);
    try {
      // Use mutation with object directly
      const success = await updateShopStatus?.mutateAsync({
        id: shop.id,
        status: newStatus
      });
      
      if (success) {
        toast({
          title: 'Status updated',
          description: `Shop status is now ${newStatus}`,
        });
      }
    } catch (error) {
      console.error('Error updating shop status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update shop status',
        variant: 'destructive',
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Case: Loading state
  if (isShopLoading) {
    return <div className="p-6">Loading shop dashboard...</div>;
  }

  // Case: No shop found for current user, show creation form
  if (!shop && shopId === undefined) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Create Your Shop</h2>
        <p className="text-gray-600 mb-6">
          You don't have a shop yet. Create one to start selling!
        </p>
        <CreateShopForm />
      </div>
    );
  }

  // Case: No shop found for the requested ID
  if (!shop && shopId) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Shop Not Found</h2>
        <p className="text-gray-600">
          The shop you're looking for doesn't exist or you don't have permission to view it.
        </p>
      </div>
    );
  }

  // Case: Shop exists but is pending approval
  if (shop?.status === 'pending') {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">{shop.name}</h2>
        <Alert className="mb-6">
          <AlertTitle>Shop Pending Approval</AlertTitle>
          <AlertDescription>
            Your shop is currently pending approval from our team. This process usually takes 1-2 business days.
          </AlertDescription>
        </Alert>
        <div className="grid gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Shop Information</h3>
            <p>
              <strong>Name:</strong> {shop.name}
            </p>
            <p>
              <strong>Description:</strong> {shop.description}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Case: Shop exists but is rejected
  if (shop?.status === 'rejected') {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">{shop.name}</h2>
        <Alert className="mb-6" variant="destructive">
          <AlertTitle>Shop Application Rejected</AlertTitle>
          <AlertDescription>
            We're sorry, but your shop application has been rejected. This may be due to incomplete information or
            our platform policies.
          </AlertDescription>
        </Alert>
        <Button
          onClick={() => handleStatusUpdate('pending' as ShopStatus)}
          disabled={isUpdatingStatus}
        >
          Reapply
        </Button>
      </div>
    );
  }

  // Case: Shop exists but is suspended
  if (shop?.status === 'suspended') {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">{shop.name}</h2>
        <Alert className="mb-6" variant="destructive">
          <AlertTitle>Shop Currently Suspended</AlertTitle>
          <AlertDescription>
            Your shop has been temporarily suspended. This may be due to policy violations or customer complaints.
            Please contact our support team for more information.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Main shop dashboard for approved shops
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{shop?.name}</h2>
        {isCurrentUserShopOwner && (
          <div className="flex items-center mt-2 md:mt-0">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 
              ${
                shop?.status === 'approved'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {shop?.status}
            </span>
          </div>
        )}
      </div>

      {isCurrentUserShopOwner && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="add-item">Add Item</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="space-y-4">
            {shop && <ShopItemsList shopId={shop.id} />}
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            {shop && <ShopOrdersList shopId={shop.id} />}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            {shop && <ShopReviewsList shopId={shop.id} />}
          </TabsContent>

          <TabsContent value="add-item" className="space-y-4">
            {shop && <AddItemForm shopId={shop.id} />}
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            {shop && <ShopSettings shopId={shop.id} />}
          </TabsContent>
        </Tabs>
      )}

      {!isCurrentUserShopOwner && shop && (
        <div className="space-y-6">
          <ShopItemsList shopId={shop.id} />
        </div>
      )}
    </div>
  );
}
