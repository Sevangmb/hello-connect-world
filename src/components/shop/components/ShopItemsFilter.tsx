
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface ShopItemsFilterProps {
  onFilterChange: (value: string) => void;
  onSortChange: (value: string) => void;
  filterValue: string;
  sortValue: string;
}

const ShopItemsFilter: React.FC<ShopItemsFilterProps> = ({ 
  onFilterChange, 
  onSortChange,
  filterValue,
  sortValue
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Input
          placeholder="Rechercher des articles..."
          value={filterValue}
          onChange={(e) => onFilterChange(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="w-full md:w-64">
        <Select value={sortValue} onValueChange={onSortChange}>
          <SelectTrigger>
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="priceLow">Prix croissant</SelectItem>
            <SelectItem value="priceHigh">Prix décroissant</SelectItem>
            <SelectItem value="newest">Plus récent</SelectItem>
            <SelectItem value="popular">Popularité</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ShopItemsFilter;
