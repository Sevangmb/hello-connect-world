
import React, { useMemo } from 'react';
import { SuitcaseListItem } from './SuitcaseListItem';
import { LoadingState } from '@/components/ui/loading-state';
import { useTransitionState } from '@/hooks/useTransitionState';
import { Suitcase } from '../types';

interface SuitcaseListProps {
  suitcases: Suitcase[];
  onSelect: (suitcase: Suitcase) => void;
  loading?: boolean;
}

export const SuitcaseList: React.FC<SuitcaseListProps> = ({
  suitcases,
  onSelect,
  loading = false
}) => {
  // Utiliser le hook de transition pour éviter les clignotements
  const isTransitioning = useTransitionState(loading);
  
  // Memoization des valises pour éviter les re-renders inutiles
  const memoizedSuitcases = useMemo(() => suitcases, [suitcases]);

  // Si en transition, afficher l'état de chargement
  if (isTransitioning) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-4 transition-opacity duration-300 ease-in-out animate-fade-in">
      {memoizedSuitcases.map((suitcase) => (
        <div key={suitcase.id} className="border border-border rounded-lg p-4">
          <SuitcaseListItem
            suitcase={suitcase}
            onSelect={() => onSelect(suitcase)}
          />
        </div>
      ))}
    </div>
  );
};
