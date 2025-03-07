
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { SuitcaseFilter } from '../types';

interface SuitcaseFiltersProps {
  filters: SuitcaseFilter;
  onFiltersChange: (filters: SuitcaseFilter) => void;
}

export const SuitcaseFilters: React.FC<SuitcaseFiltersProps> = ({ 
  filters, 
  onFiltersChange 
}) => {
  const [searchValue, setSearchValue] = React.useState(filters.search || '');

  const handleStatusChange = (value: string) => {
    onFiltersChange({
      ...filters,
      status: value as any
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({
      ...filters,
      search: searchValue
    });
  };

  const clearSearch = () => {
    setSearchValue('');
    onFiltersChange({
      ...filters,
      search: ''
    });
  };

  return (
    <div className="space-y-4">
      <Tabs 
        defaultValue={filters.status || 'active'}
        className="w-full"
        onValueChange={handleStatusChange}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Actives</TabsTrigger>
          <TabsTrigger value="archived">Archivées</TabsTrigger>
          <TabsTrigger value="completed">Terminées</TabsTrigger>
        </TabsList>
      </Tabs>

      <form onSubmit={handleSearchSubmit} className="flex items-end space-x-2">
        <div className="flex-grow">
          <Label htmlFor="search">Rechercher</Label>
          <div className="relative">
            <Input
              id="search"
              type="text"
              placeholder="Nom de la valise..."
              value={searchValue}
              onChange={handleSearchChange}
              className="pr-8"
            />
            {searchValue && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        <Button type="submit">
          <Search className="h-4 w-4 mr-2" />
          Rechercher
        </Button>
      </form>
    </div>
  );
};
