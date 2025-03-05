
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dispatch, SetStateAction } from 'react';

export interface ShopItemsFilterProps {
  filterValue: string;
  onFilterChange?: Dispatch<SetStateAction<string>>;
  setFilterValue?: Dispatch<SetStateAction<string>>;
  sortValue: string;
  onSortChange?: Dispatch<SetStateAction<string>>;
  setSortValue?: Dispatch<SetStateAction<string>>;
}

const ShopItemsFilter: React.FC<ShopItemsFilterProps> = ({
  filterValue,
  onFilterChange,
  setFilterValue,
  sortValue,
  onSortChange,
  setSortValue,
}) => {
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onFilterChange) onFilterChange(e.target.value);
    if (setFilterValue) setFilterValue(e.target.value);
  };

  const handleSortChange = (value: string) => {
    if (onSortChange) onSortChange(value);
    if (setSortValue) setSortValue(value);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="w-full sm:w-2/3">
        <Input
          placeholder="Rechercher par nom..."
          value={filterValue}
          onChange={handleFilterChange}
        />
      </div>
      <div className="w-full sm:w-1/3">
        <Select value={sortValue} onValueChange={handleSortChange}>
          <SelectTrigger>
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price-asc">Prix croissant</SelectItem>
            <SelectItem value="price-desc">Prix décroissant</SelectItem>
            <SelectItem value="name-asc">Nom (A-Z)</SelectItem>
            <SelectItem value="name-desc">Nom (Z-A)</SelectItem>
            <SelectItem value="newest">Plus récent</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ShopItemsFilter;
