
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useShop } from '@/hooks/useShop';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const ShopDetail: React.FC = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const { useShopById, useFavoriteShop, useUnfavoriteShop } = useShop();
  const { data: shop, isLoading } = useShopById(shopId);
  const favoriteShopMutation = useFavoriteShop();
  const unfavoriteShopMutation = useUnfavoriteShop();
  const [isFavorited, setIsFavorited] = useState(false);
  const { toast } = useToast();

  // Check if shop is favorited
  useEffect(() => {
    // This would be implemented in a real app
    setIsFavorited(false);
  }, [shopId]);

  const handleToggleFavorite = async () => {
    try {
      if (isFavorited) {
        await unfavoriteShopMutation.mutateAsync(shopId as string);
        setIsFavorited(false);
        toast({
          title: "Boutique retirée des favoris",
          description: "Cette boutique a été retirée de vos favoris",
        });
      } else {
        await favoriteShopMutation.mutateAsync(shopId as string);
        setIsFavorited(true);
        toast({
          title: "Boutique ajoutée aux favoris",
          description: "Cette boutique a été ajoutée à vos favoris",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification des favoris",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!shop) {
    return <div>Boutique non trouvée</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{shop.name}</h1>
          <Button onClick={handleToggleFavorite} variant={isFavorited ? "outline" : "default"}>
            {isFavorited ? "Retirer des favoris" : "Ajouter aux favoris"}
          </Button>
        </div>
        
        <div className="mb-4">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
            {shop.status}
          </span>
          <p className="text-gray-700 mt-2">{shop.description || "Aucune description disponible"}</p>
        </div>
        
        {shop.address && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Adresse</h2>
            <p>{shop.address}</p>
          </div>
        )}
        
        {shop.phone && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Téléphone</h2>
            <p>{shop.phone}</p>
          </div>
        )}
        
        {shop.website && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Site web</h2>
            <a href={shop.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {shop.website}
            </a>
          </div>
        )}
        
        <div className="mt-6">
          <Button>Voir les articles</Button>
        </div>
      </Card>
    </div>
  );
};

export default ShopDetail;
