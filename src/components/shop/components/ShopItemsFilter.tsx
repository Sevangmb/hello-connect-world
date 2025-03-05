
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface ShopItemsFilterProps {
  filterValue: string;
  onFilterChange: (value: string) => void;
  sortValue: string;
  onSortChange: (value: string) => void;
}

const ShopItemsFilter = ({ 
  filterValue, 
  onFilterChange, 
  sortValue, 
  onSortChange 
}: ShopItemsFilterProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Input
          placeholder="Search items..."
          value={filterValue}
          onChange={(e) => onFilterChange(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="w-full md:w-48">
        <Select value={sortValue} onValueChange={onSortChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="name-asc">Name: A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ShopItemsFilter;
