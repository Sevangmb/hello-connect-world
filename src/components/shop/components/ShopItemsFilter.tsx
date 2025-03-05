
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Search } from 'lucide-react';

interface ShopItemsFilterProps {
  filter: {
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
    category?: string;
  };
  setFilter: React.Dispatch<React.SetStateAction<{
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
    category?: string;
  }>>;
}

export function ShopItemsFilter({ filter, setFilter }: ShopItemsFilterProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(prev => ({ ...prev, search: e.target.value }));
  };

  const handleSortChange = (value: string) => {
    setFilter(prev => ({ 
      ...prev, 
      sortBy: value as 'price_asc' | 'price_desc' | 'newest' | 'popular' 
    }));
  };

  const handlePriceChange = (value: number[]) => {
    setFilter(prev => ({ ...prev, minPrice: value[0], maxPrice: value[1] }));
  };

  const clearFilters = () => {
    setFilter({});
  };

  return (
    <div className="bg-background p-4 rounded-md shadow-sm mb-6 space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={filter.search || ''}
            onChange={handleSearchChange}
            className="pl-8"
          />
        </div>
        <Select
          value={filter.sortBy || ''}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="popular">Popular</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={clearFilters}
          className="shrink-0"
          title="Clear filters"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Price Range Slider */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm">Price Range</span>
          <span className="text-sm">
            {filter.minPrice || 0}€ - {filter.maxPrice || 1000}€
          </span>
        </div>
        <Slider
          defaultValue={[filter.minPrice || 0, filter.maxPrice || 1000]}
          max={1000}
          step={10}
          onValueChange={handlePriceChange}
        />
      </div>
    </div>
  );
}
