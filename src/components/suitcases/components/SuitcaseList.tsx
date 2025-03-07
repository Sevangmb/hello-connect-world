
import React from 'react';
import { SuitcaseListProps } from '../types';
import { SuitcaseListItem } from './SuitcaseListItem';

export const SuitcaseList: React.FC<SuitcaseListProps> = ({ 
  suitcases, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="space-y-2">
      {suitcases.map((suitcase) => (
        <SuitcaseListItem
          key={suitcase.id}
          suitcase={suitcase}
          onEdit={() => onEdit(suitcase.id)}
          onDelete={() => onDelete(suitcase.id)}
        />
      ))}
    </div>
  );
};
