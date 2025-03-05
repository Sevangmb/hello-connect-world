import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useShop } from "@/hooks/useShop";
import { CreateShopForm } from "./CreateShopForm";
import { ShopSettings } from "./ShopSettings";
import { ShopItemsList } from "./ShopItemsList";
import { AddItemForm } from "./AddItemForm";
import { useParams, useRouter } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from 'lucide-react';
import { ShopOrdersList } from './ShopOrdersList';

const ShopDashboard = () => {
  const [tab, setTab] = useState<"items" | "orders" | "settings">("items");
  const { user } = useAuth();
  const { shop, loading, refreshShop } = useShop(user?.id);
  const { push } = useRouter();
  const { shopId } = useParams();

  useEffect(() => {
    if (shopId === 'new' && shop) {
      push(`/profile/shop/${shop.id}`);
    }
  }, [shop, push, shopId]);

  if (loading) {
    return (
      <div className="container py-10">
        <div className="mb-4">
          <Button variant="ghost" onClick={() => push('/profile')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au profil
          </Button>
        </div>
        <div className="grid gap-4">
          <Skeleton className="h-10 w-[160px]" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-10 w-[240px]" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="container py-10">
        <div className="mb-4">
          <Button variant="ghost" onClick={() => push('/profile')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au profil
          </Button>
        </div>
        <CreateShopForm />
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mb-4">
        <Button variant="ghost" onClick={() => push('/profile')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au profil
        </Button>
      </div>
      <Tabs defaultValue="items" className="w-full">
        <TabsList>
          <TabsTrigger value="items" onClick={() => setTab("items")}>Articles</TabsTrigger>
          <TabsTrigger value="orders" onClick={() => setTab("orders")}>Commandes</TabsTrigger>
          <TabsTrigger value="settings" onClick={() => setTab("settings")}>Paramètres</TabsTrigger>
        </TabsList>
        <TabsContent value="items">
          <div className="grid gap-4">
            <AddItemForm />
            <ShopItemsList shopId={shop.id} />
          </div>
        </TabsContent>
        <TabsContent value="orders">
          <ShopOrdersList shopId={shop.id} />
        </TabsContent>
        <TabsContent value="settings">
          {tab === 'settings' && shop && (
            <ShopSettings shop={shop} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShopDashboard;
