
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Grid, List } from 'lucide-react';
import { SuitcaseViewToggleProps } from '../types';

export const SuitcaseViewToggle: React.FC<SuitcaseViewToggleProps> = ({ 
  viewMode, 
  onChange 
}) => {
  return (
    <ToggleGroup 
      type="single" 
      value={viewMode} 
      onValueChange={(value) => value && onChange(value as 'grid' | 'list')}
      className="border rounded-md"
    >
      <ToggleGroupItem value="grid" aria-label="Affichage en grille">
        <Grid className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="Affichage en liste">
        <List className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
