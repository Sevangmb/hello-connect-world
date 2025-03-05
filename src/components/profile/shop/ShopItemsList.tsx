
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { AddItemForm } from './AddItemForm';
import { useShop } from '@/hooks/useShop';

interface ShopItemsListProps {
  shopId: string;
}

export const ShopItemsList = ({ shopId }: ShopItemsListProps) => {
  const { useShopItems } = useShop();
  const { data: shopItems, isLoading, error } = useShopItems(shopId);
  const [showAddForm, setShowAddForm] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-500">Une erreur est survenue lors du chargement des articles.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Articles de la boutique</CardTitle>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          variant={showAddForm ? "outline" : "default"}
        >
          {showAddForm ? "Annuler" : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter un article
            </>
          )}
        </Button>
      </CardHeader>
      
      <CardContent>
        {showAddForm && (
          <div className="mb-6">
            <AddItemForm 
              shopId={shopId} 
              onSuccess={() => setShowAddForm(false)}
            />
          </div>
        )}

        {shopItems && shopItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {shopItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  {item.image_url && (
                    <img 
                      src={item.image_url} 
                      alt={item.name} 
                      className="w-full h-48 object-cover rounded-md mb-2"
                    />
                  )}
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold">${item.price}</span>
                    <span className="text-sm text-gray-500">Stock: {item.stock}</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" className="w-full">
                      Modifier
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Aucun article n'est disponible pour le moment.</p>
        )}
      </CardContent>
    </Card>
  );
};
