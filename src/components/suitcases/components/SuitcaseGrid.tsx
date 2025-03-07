
import React from 'react';
import { SuitcaseGridProps } from '../types';
import { SuitcaseCard } from './SuitcaseCard';

export const SuitcaseGrid: React.FC<SuitcaseGridProps> = ({ 
  suitcases, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {suitcases.map((suitcase) => (
        <SuitcaseCard
          key={suitcase.id}
          suitcase={suitcase}
          onEdit={() => onEdit(suitcase.id)}
          onDelete={() => onDelete(suitcase.id)}
        />
      ))}
    </div>
  );
};
