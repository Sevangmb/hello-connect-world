
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export interface ShopItemsFilterProps {
  filterValue: string;
  onFilterChange: (value: string) => void;
  sortValue: string;
  onSortChange: (value: string) => void;
}

export const ShopItemsFilter: React.FC<ShopItemsFilterProps> = ({
  filterValue,
  onFilterChange,
  sortValue,
  onSortChange
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
      <div className="space-y-1">
        <Label htmlFor="filter">Filtrer par catégorie</Label>
        <Select value={filterValue} onValueChange={onFilterChange}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            <SelectItem value="Haut">Hauts</SelectItem>
            <SelectItem value="Bas">Bas</SelectItem>
            <SelectItem value="Veste">Vestes</SelectItem>
            <SelectItem value="Robe">Robes</SelectItem>
            <SelectItem value="Accessoire">Accessoires</SelectItem>
            <SelectItem value="Chaussures">Chaussures</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="sort">Trier par</Label>
        <Select value={sortValue} onValueChange={onSortChange}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Plus récents</SelectItem>
            <SelectItem value="price-low">Prix croissant</SelectItem>
            <SelectItem value="price-high">Prix décroissant</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ShopItemsFilter;
