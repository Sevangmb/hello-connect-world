
import React, { useMemo } from 'react';
import { Suspense } from 'react';
import { SuitcaseListItem } from './SuitcaseListItem';
import { LoadingState } from '@/components/ui/loading-state';
import { useTransitionState } from '@/hooks/useTransitionState';
import type { Suitcase } from '../types';

interface SuitcaseGridProps {
  suitcases: Suitcase[];
  onSelect: (suitcase: Suitcase) => void;
  loading?: boolean;
}

export const SuitcaseGrid: React.FC<SuitcaseGridProps> = ({ 
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 transition-opacity duration-300 ease-in-out animate-fade-in">
      {memoizedSuitcases.map((suitcase) => (
        <SuitcaseListItem
          key={suitcase.id}
          suitcase={suitcase}
          onSelect={() => onSelect(suitcase)}
        />
      ))}
    </div>
  );
};
