
import { Shirt } from "lucide-react";

interface ClothingItemCardProps {
  type: 'top' | 'bottom' | 'shoes';
  item: {
    name: string;
    image_url: string | null;
    brand?: string;
  } | null;
}

export const ClothingItemCard = ({ type, item }: ClothingItemCardProps) => {
  if (!item) return null;

  const getIcon = () => {
    switch (type) {
      case 'top':
        return <Shirt className="h-4 w-4 text-primary" />;
      case 'bottom':
        return <Shirt className="h-4 w-4 text-primary rotate-180" />;
      case 'shoes':
        return <Shirt className="h-4 w-4 text-primary -rotate-90" />;
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'top':
        return 'Haut';
      case 'bottom':
        return 'Bas';
      case 'shoes':
        return 'Chaussures';
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        {getIcon()}
        <h3 className="font-semibold">{getLabel()}</h3>
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

