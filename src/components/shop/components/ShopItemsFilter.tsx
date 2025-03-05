
import React from 'react';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';

export interface ShopItemsFilterProps {
  filterValue: string;
  onFilterChange: (value: string) => void;
  sortValue: string;
  onSortChange: (value: string) => void;
}

const ShopItemsFilter: React.FC<ShopItemsFilterProps> = ({
  filterValue,
  onFilterChange,
  sortValue,
  onSortChange
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
      <Input
        placeholder="Rechercher des articles..."
        value={filterValue}
        onChange={(e) => onFilterChange(e.target.value)}
        className="w-full sm:w-[250px]"
      />
      
      <Select value={sortValue} onValueChange={onSortChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Trier par" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Plus récents</SelectItem>
          <SelectItem value="price-asc">Prix croissant</SelectItem>
          <SelectItem value="price-desc">Prix décroissant</SelectItem>
          <SelectItem value="name">Nom</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ShopItemsFilter;
