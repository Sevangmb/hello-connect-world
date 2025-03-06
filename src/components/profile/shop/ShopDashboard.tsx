
import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Settings, Package, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { AddItemForm } from './AddItemForm';
import { ShopSettings } from './ShopSettings';
import { ShopItemsList } from './ShopItemsList';
import { ShopOrdersList } from './ShopOrdersList';
import { ShopReviewsList } from './ShopReviewsList';
import { useShop } from '@/hooks/useShop';

const ShopDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const { toast } = useToast();
  const { useUserShop } = useShop();
  const { data: shop, isLoading } = useUserShop();

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  const handleAddItemSuccess = () => {
    setIsAddItemDialogOpen(false);
    toast({
      title: "Article ajouté",
      description: "L'article a été ajouté à votre boutique avec succès.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <h2 className="text-2xl font-bold mb-4">Vous n'avez pas encore de boutique</h2>
        <p className="mb-6 text-muted-foreground">
          Créez votre boutique pour commencer à vendre vos articles.
        </p>
        <Button>Créer ma boutique</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs selectedIndex={activeTab} onSelect={handleTabChange}>
        <div className="flex justify-between items-center mb-4">
          <TabList className="flex space-x-4 border-b">
            <Tab className="px-4 py-2 cursor-pointer border-b-2 border-transparent hover:border-primary data-[selected]:border-primary data-[selected]:font-medium transition">
              Articles
            </Tab>
            <Tab className="px-4 py-2 cursor-pointer border-b-2 border-transparent hover:border-primary data-[selected]:border-primary data-[selected]:font-medium transition">
              Commandes
            </Tab>
            <Tab className="px-4 py-2 cursor-pointer border-b-2 border-transparent hover:border-primary data-[selected]:border-primary data-[selected]:font-medium transition">
              Avis
            </Tab>
            <Tab className="px-4 py-2 cursor-pointer border-b-2 border-transparent hover:border-primary data-[selected]:border-primary data-[selected]:font-medium transition">
              Paramètres
            </Tab>
          </TabList>
          {activeTab === 0 && (
            <Button size="sm" onClick={() => setIsAddItemDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          )}
        </div>

        <TabPanel>
          <Card>
            <ShopItemsList shopId={shop.id} />
          </Card>
        </TabPanel>

        <TabPanel>
          <Card>
            <ShopOrdersList shopId={shop.id} />
          </Card>
        </TabPanel>

        <TabPanel>
          <Card>
            <ShopReviewsList shopId={shop.id} />
          </Card>
        </TabPanel>

        <TabPanel>
          <ShopSettings shop={shop} />
        </TabPanel>
      </Tabs>

      <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ajouter un article</DialogTitle>
          </DialogHeader>
          <AddItemForm shopId={shop.id} onSuccess={handleAddItemSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShopDashboard;
