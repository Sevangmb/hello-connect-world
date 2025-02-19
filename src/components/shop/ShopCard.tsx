
import { useNavigate } from "react-router-dom";
import { MapPin, Store, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Store as StoreType } from "@/hooks/useStores";

export interface ShopCardProps {
  shop: StoreType;
  onAction?: () => void;
}

export function ShopCard({ shop, onAction }: ShopCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onAction) {
      onAction();
    } else {
      navigate(`/shops/${shop.id}`);
    }
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              {shop.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              par {shop.profiles?.username || "Utilisateur inconnu"}
            </p>
          </div>
          <Badge>
            <ShoppingBag className="h-3 w-3 mr-1" />
            {shop.shop_items?.length || 0} articles
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {shop.description && (
          <p className="text-sm text-muted-foreground mb-4">
            {shop.description}
          </p>
        )}
        {shop.address && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {shop.address}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
