
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export interface FilterOptions {
  sort: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
}

export interface ShopItemsFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
}

export const ShopItemsFilter = ({ onFilterChange }: ShopItemsFilterProps) => {
  const [filters, setFilters] = useState<FilterOptions>({
    sort: 'price-asc',
    minPrice: undefined,
    maxPrice: undefined,
    category: undefined
  });

  // Update parent component when filters change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleSortChange = (value: string) => {
    setFilters(prev => ({ ...prev, sort: value }));
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : undefined;
    setFilters(prev => ({ ...prev, minPrice: value }));
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : undefined;
    setFilters(prev => ({ ...prev, maxPrice: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFilters(prev => ({ ...prev, category: value || undefined }));
  };

  const handleResetFilters = () => {
    setFilters({
      sort: 'price-asc',
      minPrice: undefined,
      maxPrice: undefined,
      category: undefined
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h3 className="text-lg font-semibold mb-3">Filtres</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="sort">Trier par</Label>
          <Select value={filters.sort} onValueChange={handleSortChange}>
            <SelectTrigger id="sort">
              <SelectValue placeholder="Trier par..." />
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
        
        <div>
          <Label htmlFor="category">Catégorie</Label>
          <Select value={filters.category || ''} onValueChange={handleCategoryChange}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Toutes les catégories</SelectItem>
              <SelectItem value="vêtements">Vêtements</SelectItem>
              <SelectItem value="accessoires">Accessoires</SelectItem>
              <SelectItem value="chaussures">Chaussures</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Prix</Label>
          <div className="flex space-x-2">
            <div className="w-1/2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ''}
                onChange={handleMinPriceChange}
              />
            </div>
            <div className="w-1/2">
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ''}
                onChange={handleMaxPriceChange}
              />
            </div>
          </div>
        </div>
        
        <Button variant="outline" onClick={handleResetFilters} className="w-full">
          Réinitialiser les filtres
        </Button>
      </div>
    </div>
  );
};
