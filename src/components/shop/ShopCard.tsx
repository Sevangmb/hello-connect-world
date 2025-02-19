import { Store } from "@/hooks/useStores";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Package, Star } from "lucide-react";

interface ShopCardProps {
  shop: Store;
  onAction?: () => void;
}

export function ShopCard({ shop, onAction }: ShopCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <img
            src={shop.cover_image || "/placeholder-store.jpg"}
            alt={shop.name}
            className="h-full w-full object-cover"
          />
          {shop.is_verified && (
            <Badge className="absolute right-2 top-2" variant="success">
              Vérifié
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={shop.logo || "/placeholder-logo.jpg"} alt={shop.name} />
              <AvatarFallback>{shop.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{shop.name}</h3>
              <p className="text-sm text-muted-foreground">
                {shop.profiles?.username || "Boutique"}
              </p>
            </div>
          </div>
          <div className="flex items-center text-yellow-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="ml-1 text-sm">{shop.rating || "N/A"}</span>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {shop.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {shop.description}
            </p>
          )}
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <MapPin className="mr-1 h-4 w-4" />
              <span>{shop.location || "Non spécifié"}</span>
            </div>
            <div className="flex items-center">
              <Package className="mr-1 h-4 w-4" />
              <span>{shop.shop_items?.length || 0} articles</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {onAction && (
          <Button onClick={onAction} className="w-full">
            Voir la boutique
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
