
import React from 'react';
import { Grid, List } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { SuitcaseViewToggleProps } from '../types';

export const SuitcaseViewToggle: React.FC<SuitcaseViewToggleProps> = ({ view, onChange }) => {
  return (
    <ToggleGroup type="single" value={view} onValueChange={(value) => value && onChange(value as 'grid' | 'list')}>
      <ToggleGroupItem value="grid" aria-label="Afficher en grille">
        <Grid className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="Afficher en liste">
        <List className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
