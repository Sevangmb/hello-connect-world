
import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SuitcaseItem } from '../types';

interface SuitcaseItemCardProps {
  item: SuitcaseItem;
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
}

export const SuitcaseItemCard: React.FC<SuitcaseItemCardProps> = ({ 
  item, 
  onRemove,
  onUpdateQuantity 
}) => {
  const handleIncrement = () => {
    onUpdateQuantity(item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.quantity - 1);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative h-40 bg-gray-100">
        {item.clothes?.image_url ? (
          <img
            src={item.clothes.image_url}
            alt={item.clothes.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400">Pas d'image</span>
          </div>
        )}
        <Badge 
          className="absolute top-2 right-2"
          variant="secondary"
        >
          {item.clothes?.category || 'Vêtement'}
        </Badge>
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium text-sm truncate mb-1">
          {item.clothes?.name || 'Article sans nom'}
        </h3>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6"
              onClick={handleDecrement}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-sm w-6 text-center">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6"
              onClick={handleIncrement}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
