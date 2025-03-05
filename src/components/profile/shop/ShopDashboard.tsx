
import React, { useState } from 'react';
import { useShop } from '@/hooks/useShop';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShopItemsList } from './ShopItemsList';
import { ShopOrdersList } from './ShopOrdersList';
import { ShopReviewsList } from './ShopReviewsList';
import { ShopSettings } from './ShopSettings';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { ShopStatus } from '@/core/shop/domain/types';

interface ShopDashboardProps {
  shopId?: string;
}

export const ShopDashboard: React.FC<ShopDashboardProps> = ({ shopId }) => {
  const { shop, isShopLoading, updateShopStatus } = useShop();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Check if current user is the shop owner
  const isOwner = shop && shopId ? shop.id === shopId : false;

  if (isShopLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="flex h-48 w-full flex-col items-center justify-center">
        <h3 className="text-lg font-medium">Boutique introuvable</h3>
        <p className="text-muted-foreground">La boutique que vous recherchez n'existe pas.</p>
      </div>
    );
  }

  const handleStatusUpdate = async (newStatus: ShopStatus) => {
    setIsUpdating(true);
    try {
      await updateShopStatus.mutateAsync({
        id: shop.id,
        status: newStatus
      });
      
      toast({
        title: "Statut mis à jour",
        description: `Le statut de la boutique a été mis à jour avec succès en "${newStatus}".`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la boutique.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{shop.name}</h1>
          <p className="text-muted-foreground">{shop.description}</p>
        </div>
        
        {isOwner && (
          <div className="flex gap-2">
            {shop.status === 'pending' && (
              <Button 
                onClick={() => handleStatusUpdate('approved' as ShopStatus)} 
                variant="success"
                disabled={isUpdating}
              >
                {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Ouvrir la boutique
              </Button>
            )}
            
            {shop.status === 'approved' && (
              <Button 
                onClick={() => handleStatusUpdate('suspended' as ShopStatus)} 
                variant="outline"
                disabled={isUpdating}
              >
                {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Suspendre
              </Button>
            )}
            
            {shop.status === 'suspended' && (
              <Button 
                onClick={() => handleStatusUpdate('approved' as ShopStatus)} 
                variant="outline"
                disabled={isUpdating}
              >
                {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Réactiver
              </Button>
            )}
          </div>
        )}
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informations de la boutique</CardTitle>
          <CardDescription>Vue d'ensemble de votre boutique et de ses performances.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            <div className="rounded-lg border p-3">
              <p className="text-sm text-muted-foreground">Statut</p>
              <h3 className="text-lg font-medium">
                {shop.status === 'approved' && 'Approuvée'}
                {shop.status === 'pending' && 'En attente'}
                {shop.status === 'rejected' && 'Rejetée'} 
                {shop.status === 'suspended' && 'Suspendue'}
              </h3>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-sm text-muted-foreground">Note moyenne</p>
              <h3 className="text-lg font-medium">{shop.average_rating.toFixed(1)}/5</h3>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-sm text-muted-foreground">Nombre d'avis</p>
              <h3 className="text-lg font-medium">{shop.rating_count || 0}</h3>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-sm text-muted-foreground">Date de création</p>
              <h3 className="text-lg font-medium">{new Date(shop.created_at).toLocaleDateString()}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="items">Articles</TabsTrigger>
          <TabsTrigger value="orders">Commandes</TabsTrigger>
          <TabsTrigger value="reviews">Avis</TabsTrigger>
          {isOwner && <TabsTrigger value="settings">Paramètres</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Articles récents</CardTitle>
              </CardHeader>
              <CardContent>
                <ShopItemsList shopId={shop.id} isOwner={isOwner} limit={5} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Derniers avis</CardTitle>
              </CardHeader>
              <CardContent>
                <ShopReviewsList shopId={shop.id} limit={5} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="items">
          <ShopItemsList shopId={shop.id} isOwner={isOwner} />
        </TabsContent>
        
        <TabsContent value="orders">
          <ShopOrdersList shopId={shop.id} />
        </TabsContent>
        
        <TabsContent value="reviews">
          <ShopReviewsList shopId={shop.id} />
        </TabsContent>
        
        {isOwner && (
          <TabsContent value="settings">
            <ShopSettings shopId={shop.id} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};
