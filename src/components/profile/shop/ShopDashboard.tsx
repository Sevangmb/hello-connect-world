
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useShop } from '@/hooks/useShop';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ShopItemsList } from './ShopItemsList';
import { ShopOrdersList } from './ShopOrdersList';
import { AddItemForm } from './AddItemForm';

export const ShopDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { useUserShop } = useShop();
  const { data: shop, isLoading, error } = useUserShop();

  if (isLoading) {
    return <div>Loading shop information...</div>;
  }

  if (error) {
    return <div>Error loading shop: {error.message}</div>;
  }

  if (!shop) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">You don't have a shop yet</h2>
            <p className="text-muted-foreground">Create your shop to start selling items</p>
            <Button onClick={() => navigate('/create-shop')}>Create Shop</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{shop.name}</h1>
        <p className="text-muted-foreground">{shop.description}</p>
      </div>

      <Tabs defaultValue="items">
        <TabsList>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="add">Add Item</TabsTrigger>
        </TabsList>
        <TabsContent value="items" className="mt-4">
          <ShopItemsList />
        </TabsContent>
        <TabsContent value="orders" className="mt-4">
          <ShopOrdersList />
        </TabsContent>
        <TabsContent value="add" className="mt-4">
          <AddItemForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShopDashboard;
