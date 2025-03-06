
import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid, List } from 'lucide-react';

export interface SuitcaseViewToggleProps {
  currentView: 'list' | 'grid';
  onViewChange: (view: 'list' | 'grid') => void;
}

export const SuitcaseViewToggle: React.FC<SuitcaseViewToggleProps> = ({
  currentView,
  onViewChange
}) => {
  return (
    <div className="flex space-x-2">
      <Button
        size="sm"
        variant={currentView === 'grid' ? 'default' : 'outline'}
        onClick={() => onViewChange('grid')}
        className="transition-all duration-200"
      >
        <Grid className="h-4 w-4 mr-1" />
        Grille
      </Button>
      
      <Button
        size="sm"
        variant={currentView === 'list' ? 'default' : 'outline'}
        onClick={() => onViewChange('list')}
        className="transition-all duration-200"
      >
        <List className="h-4 w-4 mr-1" />
        Liste
      </Button>
    </div>
  );
};
