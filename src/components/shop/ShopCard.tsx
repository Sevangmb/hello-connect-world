
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MapPin, Star, Store } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { NearbyShop } from "@/hooks/shop/useNearbyShops";

interface ShopCardProps {
  shop: NearbyShop;
  showDistance?: boolean;
}

export function ShopCard({ shop, showDistance = false }: ShopCardProps) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour ajouter des favoris",
          variant: "destructive",
        });
        return;
      }
      
      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorite_shops')
          .delete()
          .eq('user_id', user.id)
          .eq('shop_id', shop.id);
          
        if (error) throw error;
        
        toast({
          title: "Suppression des favoris",
          description: `${shop.name} a été retiré de vos favoris`,
        });
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorite_shops')
          .insert({
            user_id: user.id,
            shop_id: shop.id,
          });
          
        if (error) throw error;
        
        toast({
          title: "Ajout aux favoris",
          description: `${shop.name} a été ajouté à vos favoris`,
        });
      }
      
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate a formatted date for "open since"
  const openSince = shop.created_at 
    ? format(new Date(shop.created_at), "MMMM yyyy", { locale: fr })
    : "Date inconnue";
    
  // Format distance
  const formattedDistance = shop.distance !== undefined
    ? shop.distance < 1
      ? `${Math.round(shop.distance * 1000)} m`
      : `${shop.distance.toFixed(1)} km`
    : null;

  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate(`/shops/${shop.id}`)}
    >
      <div className="relative h-48 bg-gray-200 flex items-center justify-center">
        {/* If shop has an image, we would show it here */}
        <Store className="h-12 w-12 text-gray-400" />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white text-rose-500 rounded-full h-8 w-8"
          onClick={handleFavoriteClick}
          disabled={isLoading}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? 'fill-rose-500' : ''}`} />
        </Button>
        
        {showDistance && formattedDistance && (
          <Badge 
            variant="secondary" 
            className="absolute bottom-2 left-2 bg-white/90"
          >
            <MapPin className="h-3 w-3 mr-1" />
            {formattedDistance}
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">
            {shop.name}
          </h3>
          {shop.average_rating !== null && (
            <div className="flex items-center bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
              <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" />
              {shop.average_rating.toFixed(1)}
            </div>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {shop.description || "Aucune description disponible"}
        </p>
        
        {shop.address && (
          <div className="flex items-center text-xs text-muted-foreground mb-3">
            <MapPin className="h-3 w-3 mr-1" />
            <span className="line-clamp-1">{shop.address}</span>
          </div>
        )}
        
        <div className="flex flex-wrap gap-1 mb-2">
          {shop.categories?.slice(0, 3).map((category, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              {category}
            </Badge>
          ))}
          {shop.categories && shop.categories.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{shop.categories.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="px-4 py-3 border-t bg-gray-50 flex justify-between">
        <div className="text-xs text-muted-foreground">
          Ouvert depuis {openSince}
        </div>
        <div className="text-xs font-medium">
          {shop.shop_items?.length || 0} article{shop.shop_items?.length !== 1 ? 's' : ''}
        </div>
      </CardFooter>
    </Card>
  );
}
