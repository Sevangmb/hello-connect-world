
import { Shirt, ShoppingBag, Footprints } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ClothingItemCardProps {
  type: 'top' | 'bottom' | 'shoes';
  item: {
    name: string;
    image_url: string | null;
    brand?: string;
  } | null;
}

export const ClothingItemCard = ({ type, item }: ClothingItemCardProps) => {
  if (!item) {
    return (
      <Card className="flex flex-col items-center justify-center gap-2 p-6 bg-muted/30 border border-dashed border-muted h-full min-h-[180px]">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted/50">
          {type === 'top' && <Shirt className="h-6 w-6 text-muted-foreground" />}
          {type === 'bottom' && <ShoppingBag className="h-6 w-6 text-muted-foreground" />}
          {type === 'shoes' && <Footprints className="h-6 w-6 text-muted-foreground" />}
        </div>
        <div className="text-center">
          <h3 className="font-medium text-muted-foreground mb-1">{getLabel(type)}</h3>
          <p className="text-xs text-center text-muted-foreground">Aucun vêtement disponible</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
      {/* En-tête avec type de vêtement */}
      <div className="p-3 bg-muted/30 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          {type === 'top' && <Shirt className="h-4 w-4 text-primary" />}
          {type === 'bottom' && <ShoppingBag className="h-4 w-4 text-primary" />}
          {type === 'shoes' && <Footprints className="h-4 w-4 text-primary" />}
          <h3 className="font-medium text-sm">{getLabel(type)}</h3>
        </div>
        {item.brand && (
          <Badge variant="outline" className="text-xs bg-background">
            {item.brand}
          </Badge>
        )}
      </div>
      
      {/* Image du vêtement */}
      <div className="relative aspect-square w-full flex-grow">
        <img 
          src={item.image_url || '/placeholder.svg'} 
          alt={item.name}
          className="object-cover w-full h-full"
        />
      </div>
      
      {/* Nom du vêtement */}
      <div className="p-3 text-center border-t">
        <p className="font-medium truncate">{item.name}</p>
      </div>
    </Card>
  );
};

function getLabel(type: 'top' | 'bottom' | 'shoes'): string {
  switch (type) {
    case 'top':
      return 'Haut';
    case 'bottom':
      return 'Bas';
    case 'shoes':
      return 'Chaussures';
  }
}
