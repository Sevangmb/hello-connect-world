
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

export interface ShopItemsFilterProps {
  onFilterChange: (filters: {
    sort?: string;
    minPrice?: number;
    maxPrice?: number;
    category?: string;
  }) => void;
  maxPrice?: number;
}

export const ShopItemsFilter: React.FC<ShopItemsFilterProps> = ({ 
  onFilterChange,
  maxPrice = 500
}) => {
  const [priceRange, setPriceRange] = React.useState([0, maxPrice]);
  
  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    onFilterChange({ minPrice: value[0], maxPrice: value[1] });
  };
  
  const handleSortChange = (value: string) => {
    onFilterChange({ sort: value });
  };
  
  return (
    <div className="space-y-4">
      <div>
        <Label>Trier par</Label>
        <Select onValueChange={handleSortChange}>
          <SelectTrigger>
            <SelectValue placeholder="Trier par..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price_asc">Prix: croissant</SelectItem>
            <SelectItem value="price_desc">Prix: décroissant</SelectItem>
            <SelectItem value="newest">Plus récent</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Prix</Label>
          <div className="text-sm">
            {priceRange[0]}€ - {priceRange[1]}€
          </div>
        </div>
        <Slider
          defaultValue={[0, maxPrice]}
          max={maxPrice}
          step={10}
          value={priceRange}
          onValueChange={handlePriceChange}
        />
      </div>
    </div>
  );
};

export default ShopItemsFilter;
