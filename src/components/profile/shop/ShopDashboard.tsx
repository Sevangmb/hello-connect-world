
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ShopItemsList } from '@/components/profile/shop/ShopItemsList';
import { AddItemForm } from '@/components/profile/shop/AddItemForm';
import { useShop } from '@/hooks/useShop';
import { ShopOrdersList } from './ShopOrdersList';
import { ShopReviewsList } from './ShopReviewsList';

interface ShopDashboardProps {
  shopId: string;
}

export const ShopDashboard: React.FC<ShopDashboardProps> = ({ shopId }) => {
  const { shop, isLoading, error, refetchShop } = useShop(shopId);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);

  if (isLoading) {
    return <div>Loading shop...</div>;
  }

  if (error || !shop) {
    return <div>Error loading shop data</div>;
  }

  const handleAddItemSuccess = () => {
    setIsAddItemOpen(false);
    // Refresh items list
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{shop.name} - Dashboard</h1>
        <Button onClick={() => setIsAddItemOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter un article
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ventes totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€0.00</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Nombre d'articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Note moyenne</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shop.average_rating || '0'} / 5</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="items">
        <TabsList>
          <TabsTrigger value="items">Articles</TabsTrigger>
          <TabsTrigger value="orders">Commandes</TabsTrigger>
          <TabsTrigger value="reviews">Avis</TabsTrigger>
        </TabsList>
        <TabsContent value="items">
          <Card>
            <CardContent className="p-6">
              <ShopItemsList shopId={shopId} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="orders">
          <Card>
            <CardContent className="p-6">
              <ShopOrdersList shopId={shopId} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reviews">
          <Card>
            <CardContent className="p-6">
              <ShopReviewsList shopId={shopId} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un article</DialogTitle>
          </DialogHeader>
          <AddItemForm 
            shopId={shopId} 
            onSuccess={handleAddItemSuccess} 
            onCancel={() => setIsAddItemOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShopDashboard;
