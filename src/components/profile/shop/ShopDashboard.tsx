
import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShopItemsList } from "./ShopItemsList";
import { ShopOrdersList } from "./ShopOrdersList";
import { ShopReviewsList } from "./ShopReviewsList";
import { CreateShopForm } from "./CreateShopForm";
import { Button } from "@/components/ui/button";
import { BuildingStorefront, Settings } from "lucide-react";
import { useUserShop } from "@/hooks/useShop";
import { ShopSettings } from "./ShopSettings";

export function ShopDashboard() {
  const userShop = useUserShop();
  
  useEffect(() => {
    userShop.fetchUserShop().catch(console.error);
  }, []);

  if (userShop.loading) {
    return <div>Chargement de votre boutique...</div>;
  }

  if (!userShop.userShop) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Créer votre boutique</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateShopForm onSuccess={() => userShop.fetchUserShop()} />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{userShop.userShop.name}</h1>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Paramètres
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tableau de bord de la boutique</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <BuildingStorefront className="mx-auto h-8 w-8 text-muted-foreground" />
                  <h3 className="mt-2 font-semibold">Articles</h3>
                  <p className="text-3xl font-bold">0</p>
                </div>
              </CardContent>
            </Card>
            {/* More stats cards can go here */}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="items">
        <TabsList className="w-full">
          <TabsTrigger value="items" className="flex-1">Articles</TabsTrigger>
          <TabsTrigger value="orders" className="flex-1">Commandes</TabsTrigger>
          <TabsTrigger value="reviews" className="flex-1">Avis</TabsTrigger>
          <TabsTrigger value="settings" className="flex-1">Paramètres</TabsTrigger>
        </TabsList>
        
        <TabsContent value="items">
          <ShopItemsList shopId={userShop.userShop.id} />
        </TabsContent>
        
        <TabsContent value="orders">
          <ShopOrdersList shopId={userShop.userShop.id} />
        </TabsContent>
        
        <TabsContent value="reviews">
          <ShopReviewsList shopId={userShop.userShop.id} />
        </TabsContent>
        
        <TabsContent value="settings">
          <ShopSettings shopId={userShop.userShop.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
