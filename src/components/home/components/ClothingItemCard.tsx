
import { Shirt, ShoppingBag, Footprints } from "lucide-react";

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
      <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <div className="flex items-center gap-2">
          {type === 'top' && <Shirt className="h-4 w-4 text-muted-foreground" />}
          {type === 'bottom' && <ShoppingBag className="h-4 w-4 text-muted-foreground" />}
          {type === 'shoes' && <Footprints className="h-4 w-4 text-muted-foreground" />}
          <h3 className="font-semibold text-muted-foreground">{getLabel(type)}</h3>
        </div>
        <p className="text-xs text-center text-muted-foreground">Aucun vêtement sélectionné</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        {type === 'top' && <Shirt className="h-4 w-4 text-primary" />}
        {type === 'bottom' && <ShoppingBag className="h-4 w-4 text-primary" />}
        {type === 'shoes' && <Footprints className="h-4 w-4 text-primary" />}
        <h3 className="font-semibold">{getLabel(type)}</h3>
      </div>
      <div className="relative aspect-square w-full">
        <img 
          src={item.image_url || '/placeholder.svg'} 
          alt={item.name}
          className="rounded-lg object-cover w-full h-full"
        />
      </div>
      <p className="text-sm text-center">{item.name}</p>
      {item.brand && (
        <p className="text-xs text-muted-foreground text-center">{item.brand}</p>
      )}
    </div>
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
