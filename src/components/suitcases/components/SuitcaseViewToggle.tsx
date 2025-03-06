
import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid, List } from 'lucide-react';

export interface SuitcaseViewToggleProps {
  currentView: 'grid' | 'list';
  onChangeView: (view: 'grid' | 'list') => void;
}

export const SuitcaseViewToggle = ({ 
  currentView, 
  onChangeView 
}: SuitcaseViewToggleProps) => {
  return (
    <div className="flex">
      <Button
        variant={currentView === 'grid' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => onChangeView('grid')}
        className="rounded-r-none"
      >
        <Grid className="h-4 w-4" />
      </Button>
      <Button
        variant={currentView === 'list' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => onChangeView('list')}
        className="rounded-l-none"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
};
