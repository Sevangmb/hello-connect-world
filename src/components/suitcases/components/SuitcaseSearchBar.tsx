
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { SuitcaseSearchBarProps } from '../types';

export const SuitcaseSearchBar: React.FC<SuitcaseSearchBarProps> = ({ 
  value, 
  onChange 
}) => {
  return (
    <div className="relative flex-grow">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Rechercher une valise..."
        className="pl-9"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
