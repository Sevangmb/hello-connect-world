
import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { AddItemForm } from './AddItemForm';
import { ShopItemsList } from './ShopItemsList';
import { ShopOrdersList } from './ShopOrdersList';
import { ShopReviewsList } from './ShopReviewsList';
import { ShopSettings } from './ShopSettings';
import { useShop } from '@/hooks/useShop';

export function ShopDashboard() {
  const { toast } = useToast();
  const { useUserShop } = useShop();
  const { data: shop, isLoading, error } = useUserShop();
  const [activeTab, setActiveTab] = useState(0);
  const [isAddingItem, setIsAddingItem] = useState(false);

  if (isLoading) {
    return <div className="flex justify-center p-8">Chargement de votre boutique...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>
          Impossible de charger les informations de votre boutique.
        </AlertDescription>
      </Alert>
    );
  }

  if (!shop) {
    return (
      <Alert variant="default" className="my-4">
        <AlertTitle>Aucune boutique</AlertTitle>
        <AlertDescription>
          Vous n'avez pas encore de boutique. Créez-en une pour commencer à vendre.
        </AlertDescription>
      </Alert>
    );
  }

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  const handleAddItemClick = () => {
    setIsAddingItem(true);
  };

  const handleAddItemSuccess = () => {
    setIsAddingItem(false);
    toast({
      title: "Succès",
      description: "Votre article a été ajouté avec succès.",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full mb-6">
        <CardHeader>
          <CardTitle>{shop.name}</CardTitle>
          <CardDescription>{shop.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium">Adresse</p>
              <p className="text-sm text-muted-foreground">{shop.address || 'Non renseignée'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Téléphone</p>
              <p className="text-sm text-muted-foreground">{shop.phone || 'Non renseigné'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Site web</p>
              <p className="text-sm text-muted-foreground">{shop.website || 'Non renseigné'}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex gap-2">
            <Button onClick={() => handleTabChange(4)}>Gérer la boutique</Button>
            <Button onClick={handleAddItemClick} variant="outline">Ajouter un article</Button>
          </div>
        </CardFooter>
      </Card>

      {isAddingItem && (
        <Card className="w-full mb-6">
          <CardHeader>
            <CardTitle>Ajouter un nouvel article</CardTitle>
            <CardDescription>Remplissez les informations pour ajouter un nouvel article à votre boutique.</CardDescription>
          </CardHeader>
          <CardContent>
            <AddItemForm shop={shop} onSuccess={handleAddItemSuccess} />
          </CardContent>
          <CardFooter>
            <Button variant="ghost" onClick={() => setIsAddingItem(false)}>Annuler</Button>
          </CardFooter>
        </Card>
      )}

      <Tabs selectedIndex={activeTab} onSelect={handleTabChange}>
        <TabList className="flex border-b mb-4">
          <Tab className="px-4 py-2 cursor-pointer" selectedClassName="border-b-2 border-primary">Articles</Tab>
          <Tab className="px-4 py-2 cursor-pointer" selectedClassName="border-b-2 border-primary">Commandes</Tab>
          <Tab className="px-4 py-2 cursor-pointer" selectedClassName="border-b-2 border-primary">Avis</Tab>
          <Tab className="px-4 py-2 cursor-pointer" selectedClassName="border-b-2 border-primary">Ventes</Tab>
          <Tab className="px-4 py-2 cursor-pointer" selectedClassName="border-b-2 border-primary">Paramètres</Tab>
        </TabList>

        <TabPanel>
          <ShopItemsList shopId={shop.id} />
        </TabPanel>
        <TabPanel>
          <ShopOrdersList shopId={shop.id} />
        </TabPanel>
        <TabPanel>
          <ShopReviewsList shopId={shop.id} />
        </TabPanel>
        <TabPanel>
          <div>Rapport des ventes</div>
        </TabPanel>
        <TabPanel>
          <ShopSettings />
        </TabPanel>
      </Tabs>
    </div>
  );
}
