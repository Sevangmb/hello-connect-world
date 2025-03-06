
import React, { useMemo } from 'react';
import { Suspense } from 'react';
import { SuitcaseListItem } from './SuitcaseListItem';
import { LoadingState } from '@/components/ui/loading-state';
import type { Suitcase } from '../types';

interface SuitcaseGridProps {
  suitcases: Suitcase[];
  onSelect: (suitcase: Suitcase) => void;
}

export const SuitcaseGrid: React.FC<SuitcaseGridProps> = ({ 
  suitcases, 
  onSelect 
}) => {
  const memoizedSuitcases = useMemo(() => suitcases, [suitcases]);

  return (
    <Suspense fallback={<LoadingState />}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
        {memoizedSuitcases.map((suitcase) => (
          <SuitcaseListItem
            key={suitcase.id}
            suitcase={suitcase}
            onSelect={() => onSelect(suitcase)}
          />
        ))}
      </div>
    </Suspense>
  );
};
