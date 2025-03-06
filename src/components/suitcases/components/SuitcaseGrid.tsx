
import React from 'react';
import SuitcaseCard from './SuitcaseCard';
import SuitcaseListItem from './SuitcaseListItem';
import { Dispatch, SetStateAction } from 'react';

export interface SuitcaseGridProps {
  suitcases: any[];
  viewMode: 'list' | 'grid';
  selectedSuitcaseId: string;
  setSelectedSuitcaseId: Dispatch<SetStateAction<string>>;
}

const SuitcaseGrid = ({ suitcases, viewMode, selectedSuitcaseId, setSelectedSuitcaseId }: SuitcaseGridProps) => {
  if (suitcases.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Vous n'avez pas encore créé de valise.</p>
      </div>
    );
  }

  return (
    <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
      {suitcases.map((suitcase) => (
        viewMode === 'grid' ? (
          <SuitcaseCard
            key={suitcase.id}
            suitcase={suitcase}
            isSelected={selectedSuitcaseId === suitcase.id}
            onSelect={() => setSelectedSuitcaseId(suitcase.id)}
          />
        ) : (
          <SuitcaseListItem
            key={suitcase.id}
            suitcase={suitcase}
            isSelected={selectedSuitcaseId === suitcase.id}
            onSelect={() => setSelectedSuitcaseId(suitcase.id)}
          />
        )
      ))}
    </div>
  );
};

export default SuitcaseGrid;
