
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { ShopItemsList } from './ShopItemsList';
import { ShopOrdersList } from './ShopOrdersList';
import { ShopReviewsList } from './ShopReviewsList';
import { AddItemForm } from './AddItemForm';
import { useShop } from '@/hooks/useShop';

export default function ShopDashboard() {
  const { toast } = useToast();
  const { useUserShop } = useShop();
  const { data: shop, isLoading, error } = useUserShop();
  
  const [activeTab, setActiveTab] = useState('items');
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);

  if (isLoading) {
    return <div>Loading shop information...</div>;
  }

  if (error) {
    return <div>Error loading shop: {error.message}</div>;
  }

  if (!shop) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>No Shop Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You don't have a shop yet. Create one to start selling.</p>
            <Button className="mt-4">Create Shop</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">{shop.name} Dashboard</h1>
        <p className="text-muted-foreground">{shop.description}</p>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          {activeTab === 'items' && (
            <Button onClick={() => setIsAddItemDialogOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Item
            </Button>
          )}
        </div>

        <TabsContent value="items">
          <ShopItemsList shopId={shop.id} />
        </TabsContent>
        
        <TabsContent value="orders">
          <ShopOrdersList shopId={shop.id} />
        </TabsContent>
        
        <TabsContent value="reviews">
          <ShopReviewsList shopId={shop.id} />
        </TabsContent>
      </Tabs>

      <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <AddItemForm 
            shopId={shop.id} 
            onSuccess={() => {
              setIsAddItemDialogOpen(false);
              toast({
                title: "Item Added",
                description: "Your item has been added to your shop.",
              });
            }} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
