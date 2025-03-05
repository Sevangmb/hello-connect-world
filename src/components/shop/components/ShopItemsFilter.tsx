
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

export interface ShopItemsFilterProps {
  filter: {
    search: string;
    minPrice: number;
    maxPrice: number;
    category: string;
    sort: string;
  };
  setFilter: (filter: any) => void;
}

export const ShopItemsFilter: React.FC<ShopItemsFilterProps> = ({ filter, setFilter }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, search: e.target.value });
  };

  const handlePriceChange = (value: number[]) => {
    setFilter({ ...filter, minPrice: value[0], maxPrice: value[1] });
  };

  const handleCategoryChange = (value: string) => {
    setFilter({ ...filter, category: value });
  };

  const handleSortChange = (value: string) => {
    setFilter({ ...filter, sort: value });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search items..."
              value={filter.search}
              onChange={handleSearchChange}
            />
          </div>

          <div>
            <Label className="mb-2 block">Price Range</Label>
            <div className="px-2">
              <Slider
                defaultValue={[filter.minPrice, filter.maxPrice]}
                max={1000}
                step={10}
                onValueChange={handlePriceChange}
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>{filter.minPrice}€</span>
                <span>{filter.maxPrice}€</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={filter.category} onValueChange={handleCategoryChange}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="shoes">Shoes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sort">Sort by</Label>
              <Select value={filter.sort} onValueChange={handleSortChange}>
                <SelectTrigger id="sort">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="priceAsc">Price: Low to High</SelectItem>
                  <SelectItem value="priceDesc">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
