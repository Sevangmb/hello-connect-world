
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SuitcaseHeaderProps } from '../types';

export const SuitcaseHeader: React.FC<SuitcaseHeaderProps> = ({ onRefresh }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Mes Valises</h1>
        <p className="text-muted-foreground">
          Gérez les vêtements à emporter pour vos voyages.
        </p>
      </div>

      <Button 
        variant="outline" 
        onClick={onRefresh}
        className="mt-2 sm:mt-0"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Actualiser
      </Button>
    </div>
  );
};
