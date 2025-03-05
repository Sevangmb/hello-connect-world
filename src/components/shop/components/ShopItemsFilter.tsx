
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

export interface ShopItemsFilterProps {
  filters: {
    sort: string;
    minPrice?: number;
    maxPrice?: number;
    category?: string;
  };
  onFilterChange: (newFilters: {
    sort: string;
    minPrice?: number;
    maxPrice?: number;
    category?: string;
  }) => void;
}

export const ShopItemsFilter: React.FC<ShopItemsFilterProps> = ({
  filters,
  onFilterChange,
}) => {
  const handleSortChange = (value: string) => {
    onFilterChange({ ...filters, sort: value });
  };

  const handlePriceChange = (
    type: 'minPrice' | 'maxPrice',
    value: number | undefined
  ) => {
    onFilterChange({ ...filters, [type]: value });
  };

  const handleCategoryChange = (value: string) => {
    onFilterChange({ ...filters, category: value });
  };

  const handleResetFilters = () => {
    onFilterChange({
      sort: 'created_at:desc',
      minPrice: undefined,
      maxPrice: undefined,
      category: undefined,
    });
  };

  return (
    <div className="space-y-2 p-4 border rounded-md">
      <h3 className="font-medium mb-2">Filtres</h3>

      <div className="space-y-4">
        <div>
          <label className="text-sm">Trier par:</label>
          <Select value={filters.sort} onValueChange={handleSortChange}>
            <SelectTrigger>
              <SelectValue placeholder="Trier par..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at:desc">Plus récent</SelectItem>
              <SelectItem value="created_at:asc">Plus ancien</SelectItem>
              <SelectItem value="price:asc">Prix croissant</SelectItem>
              <SelectItem value="price:desc">Prix décroissant</SelectItem>
              <SelectItem value="name:asc">Nom A-Z</SelectItem>
              <SelectItem value="name:desc">Nom Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleResetFilters}
        >
          Réinitialiser les filtres
        </Button>
      </div>
    </div>
  );
};
