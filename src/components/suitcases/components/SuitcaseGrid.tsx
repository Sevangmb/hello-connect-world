
import React from 'react';
import { Suitcase } from '@/components/suitcases/utils/types';
import SuitcaseCard from './SuitcaseCard';
import SuitcaseListItem from './SuitcaseListItem';

interface SuitcaseGridProps {
  suitcases: Suitcase[];
  view: 'grid' | 'list';
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export const SuitcaseGrid: React.FC<SuitcaseGridProps> = ({
  suitcases,
  view,
  onDelete,
  onEdit
}) => {
  if (view === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suitcases.map(suitcase => (
          <SuitcaseCard
            key={suitcase.id}
            suitcase={suitcase}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {suitcases.map(suitcase => (
        <SuitcaseListItem
          key={suitcase.id}
          suitcase={suitcase}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};
