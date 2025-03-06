
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SuitcaseFiltersProps } from '../types';

export const SuitcaseFilters: React.FC<SuitcaseFiltersProps> = ({
  filters,
  statusLabels,
  onStatusChange,
  onClearSearch
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de recherche ici
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    onClearSearch();
  };

  return (
    <div className="w-full md:w-auto">
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <form onSubmit={handleSearch} className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher une valise..."
            className="w-full pl-8 pr-8"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>

        <div className="flex space-x-1">
          {Object.entries(statusLabels).map(([status, label]) => (
            <button
              key={status}
              className={`px-3 py-1 text-sm rounded-md ${
                filters.status === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground'
              }`}
              onClick={() => onStatusChange(status)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
