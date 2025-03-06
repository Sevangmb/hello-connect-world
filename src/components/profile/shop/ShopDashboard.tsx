
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { useShop } from '@/hooks/useShop';
import { ShopItemsList } from './ShopItemsList';
import { ShopOrdersList } from './ShopOrdersList';
import { AddItemForm } from './AddItemForm';
import { Button } from '@/components/ui/button';
import ShopReviewsList from './ShopReviewsList';
import { Shop } from '@/core/shop/domain/types';

const ShopDashboard: React.FC = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const { useShopById, useUserShop } = useShop();
  const { data: userShop, isLoading: userShopLoading } = useUserShop();
  const { data: shop, isLoading: shopLoading } = useShopById(shopId);
  
  const [isAddingItem, setIsAddingItem] = useState(false);
  const isOwner = shopId ? userShop?.id === shopId : false;
  
  const currentShop: Shop | undefined = shop || userShop;
  
  if (shopLoading || userShopLoading) {
    return <div className="p-4">Chargement de la boutique...</div>;
  }
  
  if (!currentShop) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Boutique introuvable</h2>
        <p>La boutique que vous recherchez n'existe pas ou vous n'avez pas accès.</p>
      </div>
    );
  }
  
  const handleAddItemSuccess = () => {
    setIsAddingItem(false);
  };
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{currentShop.name}</h2>
        {isOwner && (
          <Button 
            onClick={() => setIsAddingItem(!isAddingItem)}
            variant={isAddingItem ? "outline" : "default"}
          >
            {isAddingItem ? "Annuler" : "Ajouter un article"}
          </Button>
        )}
      </div>
      
      {isAddingItem && isOwner && (
        <div className="mb-6 p-4 border rounded-md">
          <h3 className="text-lg font-semibold mb-4">Ajouter un nouvel article</h3>
          <AddItemForm 
            shop={currentShop} 
            onSuccess={handleAddItemSuccess} 
          />
        </div>
      )}
      
      <Tabs className="mt-6">
        <TabList>
          <Tab>Articles</Tab>
          {isOwner && <Tab>Commandes</Tab>}
          <Tab>Avis</Tab>
        </TabList>
        
        <TabPanel>
          <ShopItemsList shopId={currentShop.id} />
        </TabPanel>
        
        {isOwner && (
          <TabPanel>
            <ShopOrdersList shopId={currentShop.id} />
          </TabPanel>
        )}
        
        <TabPanel>
          <ShopReviewsList shopId={currentShop.id} />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default ShopDashboard;
