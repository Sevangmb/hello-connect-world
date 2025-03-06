
import React from 'react';
import { ClothesCard } from './ClothesCard';
import { Loader2 } from 'lucide-react';

interface ClothesGridProps {
  clothes: any[];
  loading: boolean;
  onSelectItem?: (item: any) => void;
  selectedItem?: any;
}

export function ClothesGrid({ clothes, loading, onSelectItem, selectedItem }: ClothesGridProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!clothes?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun vêtement trouvé
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {clothes.map((cloth) => (
        <div 
          key={cloth.id} 
          className={`cursor-pointer ${selectedItem?.id === cloth.id ? 'ring-2 ring-primary' : ''}`}
          onClick={() => onSelectItem && onSelectItem(cloth)}
        >
          <ClothesCard
            cloth={cloth}
            simple={true}
          />
        </div>
      ))}
    </div>
  );
}
