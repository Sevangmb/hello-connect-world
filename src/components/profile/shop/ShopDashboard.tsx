
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useShop } from "@/hooks/useShop";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateShopForm from "./CreateShopForm";
import AddItemForm from "./AddItemForm";
import ShopItemsList from "./ShopItemsList";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import ShopOrdersList from "./ShopOrdersList";
import ShopSettings from "./ShopSettings";

export default function ShopDashboard() {
  const { user } = useAuth();
  const { shop, isShopLoading, refetchShop } = useShop();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  if (isShopLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!shop) {
    return <CreateShopForm onSuccess={() => refetchShop()} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">{shop.name}</h1>
          <p className="text-muted-foreground">{shop.description}</p>
        </div>
        <Button
          onClick={() => navigate(`/shop/${shop.id}`)}
          variant="outline"
        >
          Voir ma boutique
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="products">Produits</TabsTrigger>
          <TabsTrigger value="orders">Commandes</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total des ventes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0 €</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Produits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Commandes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ajouter un produit</CardTitle>
            </CardHeader>
            <CardContent>
              <AddItemForm shopId={shop.id} />
            </CardContent>
          </Card>

          <ShopItemsList shopId={shop.id} />
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <ShopOrdersList shopId={shop.id} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <ShopSettings shop={shop} onUpdate={() => refetchShop()} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
