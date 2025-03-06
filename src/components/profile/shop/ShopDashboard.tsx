
import React from 'react';
import { ShopSection } from './ShopSection';
import { PurchasesSection } from './PurchasesSection';
import { SalesSection } from './SalesSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShopSettings } from './ShopSettings';
import { ShopReviewsList } from './ShopReviewsList';

const ShopDashboard = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Boutique</h1>
      
      <Tabs defaultValue="shop">
        <TabsList className="mb-4">
          <TabsTrigger value="shop">Ma boutique</TabsTrigger>
          <TabsTrigger value="sales">Ventes</TabsTrigger>
          <TabsTrigger value="purchases">Achats</TabsTrigger>
          <TabsTrigger value="reviews">Avis</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>
        
        <TabsContent value="shop">
          <ShopSection />
        </TabsContent>
        
        <TabsContent value="sales">
          <SalesSection />
        </TabsContent>
        
        <TabsContent value="purchases">
          <PurchasesSection />
        </TabsContent>
        
        <TabsContent value="reviews">
          <ShopReviewsList />
        </TabsContent>
        
        <TabsContent value="settings">
          <ShopSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShopDashboard;
