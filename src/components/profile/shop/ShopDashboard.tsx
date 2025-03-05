import React, { useState } from 'react';
import { useShop } from '@/hooks/useShop';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Settings, Package, CreditCard, DollarSign } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import CreateShopForm from './CreateShopForm';
import ShopItemsList from './ShopItemsList';
import AddItemForm from './AddItemForm';
import ShopSettings from './ShopSettings';
import ShopOrdersList from './ShopOrdersList';

interface AddItemFormProps {
  shopId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ shopId, onSuccess, onCancel }) => {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Ajouter un produit</CardTitle>
        </CardHeader>
        <CardContent>
          <AddItemForm 
            shopId={shopId}
            onCancel={onCancel}
            onSuccess={onSuccess}
          />
        </CardContent>
      </Card>
    </div>
  );
};

const ShopDashboard = () => {
  const { user } = useAuth();
  const { shop, isShopLoading, refetchShop } = useShop();
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  
  // Handle shop creation success
  const handleShopCreated = async () => {
    await refetchShop();
    setShowCreateForm(false);
  };

  if (isShopLoading) {
    return (
      <div className="container mx-auto p-4">
        <Skeleton className="h-12 w-1/3 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!shop && !showCreateForm) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Créez votre boutique</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Vous n'avez pas encore de boutique. Créez-en une pour commencer à vendre vos vêtements.
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Créer ma boutique
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Créer ma boutique</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateShopForm onSuccess={handleShopCreated} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{shop?.name || 'Ma boutique'}</CardTitle>
          <Button variant="outline" onClick={() => setActiveTab('settings')}>
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </Button>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="products">Produits</TabsTrigger>
          <TabsTrigger value="orders">Commandes</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Vue d'ensemble</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Produits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-2xl font-bold">0</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Commandes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-2xl font-bold">0</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Revenus</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-2xl font-bold">0€</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Produits</CardTitle>
              <Button onClick={() => setShowAddItemForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un produit
              </Button>
            </CardHeader>
            <CardContent>
              {showAddItemForm ? (
                <AddItemForm 
                  shopId={shop?.id}
                  onCancel={() => setShowAddItemForm(false)}
                  onSuccess={() => {
                    setShowAddItemForm(false);
                  }}
                />
              ) : (
                <ShopItemsList shopId={shop?.id} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Commandes</CardTitle>
            </CardHeader>
            <CardContent>
              <ShopOrdersList shopId={shop?.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <ShopSettings shop={shop} onUpdate={refetchShop} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShopDashboard;
