
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { SuitcaseHeaderProps } from '../types';

export const SuitcaseHeader: React.FC<SuitcaseHeaderProps> = ({ 
  title, 
  description, 
  actions 
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0 mb-4">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && <p className="text-gray-500">{description}</p>}
      </div>
      <div className="flex items-center space-x-2">
        {actions}
      </div>
    </div>
  );
};

export const SuitcaseHeaderActions: React.FC<{ onCreateClick: () => void }> = ({ onCreateClick }) => {
  return (
    <Button onClick={onCreateClick}>
      <Plus className="h-4 w-4 mr-2" />
      Nouvelle valise
    </Button>
  );
};
