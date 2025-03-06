import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ShopItemsList } from "./ShopItemsList";
import { ShopOrdersList } from "./ShopOrdersList";
import ShopReviewsList from "./ShopReviewsList";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { AddItemForm } from './AddItemForm';
import { useShop } from '@/hooks/useShop';
import ShopSettings from './ShopSettings';

const ShopDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('items');
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const { toast } = useToast();
  const { useUserShop } = useShop();
  const { userShop, loading, error, fetchUserShop } = useUserShop();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleAddItemSuccess = () => {
    setIsAddItemDialogOpen(false);
    toast({
      title: "Article ajouté",
      description: "L'article a été ajouté à votre boutique avec succès.",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <h2 className="text-2xl font-bold mb-4">Une erreur s'est produite</h2>
        <p className="mb-6 text-muted-foreground">
          Veuillez réessayer plus tard.
        </p>
      </div>
    );
  }

  if (!userShop) {
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
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="flex justify-between items-center mb-4">
          <TabsList className="flex space-x-4 border-b">
            <TabsTrigger value="items" className="px-4 py-2 cursor-pointer border-b-2 border-transparent hover:border-primary data-[state=active]:border-primary data-[state=active]:font-medium transition">
              Articles
            </TabsTrigger>
            <TabsTrigger value="orders" className="px-4 py-2 cursor-pointer border-b-2 border-transparent hover:border-primary data-[state=active]:border-primary data-[state=active]:font-medium transition">
              Commandes
            </TabsTrigger>
            <TabsTrigger value="reviews" className="px-4 py-2 cursor-pointer border-b-2 border-transparent hover:border-primary data-[state=active]:border-primary data-[state=active]:font-medium transition">
              Avis
            </TabsTrigger>
            <TabsTrigger value="settings" className="px-4 py-2 cursor-pointer border-b-2 border-transparent hover:border-primary data-[state=active]:border-primary data-[state=active]:font-medium transition">
              Paramètres
            </TabsTrigger>
          </TabsList>
          {activeTab === 'items' && (
            <Button size="sm" onClick={() => setIsAddItemDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          )}
        </div>

        <TabsContent value="items">
          <Card>
            <ShopItemsList shopId={userShop.id} />
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <ShopOrdersList shopId={userShop.id} />
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <ShopReviewsList shopId={userShop.id} />
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <ShopSettings shopId={userShop.id} />
        </TabsContent>
      </Tabs>

      <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ajouter un article</DialogTitle>
          </DialogHeader>
          <AddItemForm shopId={userShop.id} onSuccess={handleAddItemSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShopDashboard;
