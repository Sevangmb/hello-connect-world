
import React from 'react';
import { SuitcaseCard } from './SuitcaseCard';
import { SuitcaseGridProps } from '../types';

export const SuitcaseGrid: React.FC<SuitcaseGridProps> = ({ 
  suitcases, 
  onSelectSuitcase 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {suitcases.map((suitcase) => (
        <SuitcaseCard
          key={suitcase.id}
          suitcase={suitcase}
          onClick={() => onSelectSuitcase(suitcase.id)}
        />
      ))}
    </div>
  );
};
