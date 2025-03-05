
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export interface ShopItemsFilterProps {
  currentFilter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  currentSort: string;
  setSort: React.Dispatch<React.SetStateAction<string>>;
}

const ShopItemsFilter: React.FC<ShopItemsFilterProps> = ({ 
  currentFilter, 
  setFilter, 
  currentSort, 
  setSort 
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="w-full sm:w-auto">
        <Label htmlFor="filter-select" className="text-sm font-medium mb-1 block">
          Filter by
        </Label>
        <Select
          value={currentFilter}
          onValueChange={setFilter}
        >
          <SelectTrigger id="filter-select" className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter items" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Items</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="soldOut">Sold Out</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full sm:w-auto">
        <Label htmlFor="sort-select" className="text-sm font-medium mb-1 block">
          Sort by
        </Label>
        <Select
          value={currentSort}
          onValueChange={setSort}
        >
          <SelectTrigger id="sort-select" className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort items" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="priceLow">Price: Low to High</SelectItem>
            <SelectItem value="priceHigh">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ShopItemsFilter;
