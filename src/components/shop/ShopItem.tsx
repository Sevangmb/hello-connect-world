
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";

export interface ShopItemProps {
  item: {
    id: string;
    name?: string;
    description?: string;
    price?: number;
    image_url?: string;
    clothes?: {
      name?: string;
      description?: string;
      image_url?: string;
    };
  };
}

export function ShopItem({ item }: ShopItemProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>{item.clothes?.name || item.name || "Article sans nom"}</CardTitle>
      </CardHeader>
      {(item.clothes?.image_url || item.image_url) && (
        <div className="relative aspect-square">
          <img
            src={item.clothes?.image_url || item.image_url}
            alt={item.clothes?.name || item.name}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">
          {item.clothes?.description || item.description}
        </p>
        {item.price && (
          <Badge variant="secondary" className="mt-2">
            {item.price}€
          </Badge>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          Ajouter au panier
        </Button>
      </CardFooter>
    </Card>
  );
}
