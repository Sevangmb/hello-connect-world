
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useShop } from "@/hooks/useShop";
import { Loader2, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks/cart";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface ShopItemsFilterProps {
  category?: string;
  onChange: (value: string) => void;
}

const ShopItemsFilter = ({ onChange }: ShopItemsFilterProps) => {
  return (
    <div className="mb-4">
      <Input
        type="search"
        placeholder="Rechercher des articles..."
        onChange={(e) => onChange(e.target.value)}
        className="w-full max-w-sm"
      />
    </div>
  );
};

export function ShopItems({ shopId }: { shopId: string }) {
  const { shopItems, areShopItemsLoading } = useShop(shopId);
  const { user } = useAuth();
  const { addToCart } = useCart(user?.id || null);
  const [search, setSearch] = useState("");

  const filteredItems = shopItems?.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddToCart = (item: any) => {
    if (!user) return;
    
    addToCart.mutate({
      user_id: user.id,
      item_id: item.id,
      quantity: 1
    });
  };

  if (areShopItemsLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <ShopItemsFilter onChange={setSearch} />
      
      {filteredItems?.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Aucun article trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems?.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              {item.image_url ? (
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              ) : (
                <div className="aspect-square bg-muted flex items-center justify-center">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <CardHeader className="p-4 pb-0">
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <div className="flex justify-between items-center mt-1">
                  <div className="font-bold">{formatPrice(item.price)}</div>
                  <Badge variant="secondary">
                    {item.stock > 0 ? `${item.stock} en stock` : "Épuisé"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.description || "Aucune description disponible"}
                </p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button 
                  className="w-full" 
                  disabled={item.stock <= 0 || !user || addToCart.isPending}
                  onClick={() => handleAddToCart(item)}
                >
                  {addToCart.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ShoppingBag className="mr-2 h-4 w-4" />
                  )}
                  Ajouter au panier
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
