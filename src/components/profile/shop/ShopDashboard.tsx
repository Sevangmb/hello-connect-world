
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useShop } from '@/hooks/useShop';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShopItemsList } from './ShopItemsList';
import { ShopOrdersList } from './ShopOrdersList';
import ShopReviewsList from './ShopReviewsList';
import AddItemForm from './AddItemForm';

export const ShopDashboard = () => {
  const { user } = useAuth();
  const { 
    shop, isShopLoading, shopError, refetchShop,
    isCreatingShop, isUpdatingShop 
  } = useShop();
  
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [activeTab, setActiveTab] = useState('items');

  if (isShopLoading) {
    return <div className="flex justify-center p-6">Chargement de votre boutique...</div>;
  }

  if (shopError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>
          Impossible de charger les données de votre boutique. Veuillez réessayer plus tard.
        </AlertDescription>
      </Alert>
    );
  }

  if (!shop) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Boutique non trouvée</CardTitle>
          <CardDescription>
            Vous n'avez pas encore de boutique. Créez-en une pour commencer à vendre vos articles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button disabled={isCreatingShop}>
            {isCreatingShop ? 'Création en cours...' : 'Créer une boutique'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{shop.name}</CardTitle>
              <CardDescription>{shop.description}</CardDescription>
            </div>
            <Button 
              variant="outline" 
              disabled={isUpdatingShop}
              onClick={() => console.log('Éditer boutique')}
            >
              Modifier
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="border rounded p-3 text-center">
              <div className="text-2xl font-bold">{shop.total_ratings || 0}</div>
              <div className="text-sm text-gray-500">Avis</div>
            </div>
            <div className="border rounded p-3 text-center">
              <div className="text-2xl font-bold">{shop.average_rating || 0}/5</div>
              <div className="text-sm text-gray-500">Note moyenne</div>
            </div>
            <div className="border rounded p-3 text-center">
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-gray-500">Ventes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="items">Articles</TabsTrigger>
          <TabsTrigger value="orders">Commandes</TabsTrigger>
          <TabsTrigger value="reviews">Avis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="items" className="space-y-4">
          {!isAddingItem ? (
            <>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Vos articles</h3>
                <Button onClick={() => setIsAddingItem(true)}>Ajouter un article</Button>
              </div>
              <Separator />
              <ShopItemsList shopId={shop.id} />
            </>
          ) : (
            <AddItemForm 
              shopId={shop.id} 
              onSuccess={() => {
                setIsAddingItem(false);
                refetchShop();
              }}
              onCancel={() => setIsAddingItem(false)}
            />
          )}
        </TabsContent>
        
        <TabsContent value="orders">
          <ShopOrdersList shopId={shop.id} />
        </TabsContent>
        
        <TabsContent value="reviews">
          <ShopReviewsList shopId={shop.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShopDashboard;
