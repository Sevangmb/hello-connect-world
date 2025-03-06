
import React from 'react';
import { SuitcaseListItem } from './SuitcaseListItem';
import { SuitcaseGridProps } from '../types';

export const SuitcaseGrid: React.FC<SuitcaseGridProps> = ({ 
  suitcases, 
  onSelectSuitcase 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {suitcases.map((suitcase) => (
        <SuitcaseListItem
          key={suitcase.id}
          suitcase={suitcase}
          onSelect={onSelectSuitcase}
        />
      ))}
    </div>
  );
};
