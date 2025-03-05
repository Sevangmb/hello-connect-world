import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface ShopItemsFilterProps {
  filterValue: string;
  setFilterValue: React.Dispatch<React.SetStateAction<string>>;
  sortValue: string;
  setSortValue: React.Dispatch<React.SetStateAction<string>>;
}

export function ShopItemsFilter({ 
  filterValue, 
  setFilterValue, 
  sortValue, 
  setSortValue 
}: ShopItemsFilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Input
          placeholder="Search items..."
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="w-full md:w-48">
        <Select value={sortValue} onValueChange={setSortValue}>
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
