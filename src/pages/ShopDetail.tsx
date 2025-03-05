
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useShop } from "@/hooks/useShop";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Phone, Globe, Heart, ShoppingCart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { ShopItems } from "@/components/shop/ShopItems";

export default function ShopDetail() {
  const { shopId } = useParams();
  const { getShopById, shop, isShopLoading, favoriteShop, isFavorited, checkIfFavorited } = useShop();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (shopId) {
      getShopById(shopId);
      checkIfShopIsFavorited();
    }
  }, [shopId]);

  const checkIfShopIsFavorited = async () => {
    if (shopId) {
      const result = await checkIfFavorited(shopId);
      setIsFavorite(result);
    }
  };

  const handleFavorite = async () => {
    try {
      if (shopId) {
        await favoriteShop(shopId, !isFavorite);
        setIsFavorite(!isFavorite);
        toast({
          title: !isFavorite ? "Boutique ajoutée aux favoris" : "Boutique retirée des favoris",
          description: !isFavorite ? "Cette boutique a été ajoutée à vos favoris" : "Cette boutique a été retirée de vos favoris",
        });
      }
    } catch (error) {
      console.error("Error favoriting shop:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  if (isShopLoading) {
    return <div className="container mx-auto p-4">Chargement de la boutique...</div>;
  }

  if (!shop) {
    return <div className="container mx-auto p-4">Boutique non trouvée</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shop details */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="flex flex-col items-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={shop.image_url} />
                <AvatarFallback>{shop.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4 text-center">{shop.name}</CardTitle>
              <div className="flex items-center justify-center mt-2">
                <Star className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" />
                <span className="font-medium">{shop.average_rating.toFixed(1)}</span>
                <span className="text-gray-500 ml-1">({shop.rating_count} avis)</span>
              </div>
              <div className="mt-2 flex space-x-2">
                <Badge variant={shop.status === 'approved' ? 'default' : 'secondary'}>
                  {shop.status === 'approved' ? 'Vérifiée' : 'En attente'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm">{shop.description}</div>
              
              {shop.address && (
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                  <span className="text-sm">{shop.address}</span>
                </div>
              )}
              
              {shop.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <span className="text-sm">{shop.phone}</span>
                </div>
              )}
              
              {shop.website && (
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  <a href={shop.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                    {shop.website}
                  </a>
                </div>
              )}
              
              <div className="pt-4 flex space-x-2">
                <Button 
                  onClick={handleFavorite} 
                  variant={isFavorite ? "default" : "outline"}
                  className="flex-1"
                >
                  <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                  {isFavorite ? 'Favori' : 'Ajouter aux favoris'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Shop items */}
        <div className="lg:col-span-2">
          <ShopItems shop={shop} />
        </div>
      </div>
    </div>
  );
}
