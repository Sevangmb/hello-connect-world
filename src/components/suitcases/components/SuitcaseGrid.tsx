
import React from 'react';
import SuitcaseCard from './SuitcaseCard';
import SuitcaseListItem from './SuitcaseListItem';

interface SuitcaseCardProps {
  suitcase: any;
  isSelected: boolean;
  onSelect: () => void;
}

interface SuitcaseListItemProps {
  suitcase: any;
  isSelected: boolean;
  onSelect: () => void;
}

interface SuitcaseGridProps {
  suitcases: any[];
  viewMode: 'grid' | 'list';
  selectedSuitcaseId: string;
  setSelectedSuitcaseId: (id: string) => void;
}

export function SuitcaseGrid({ 
  suitcases, 
  viewMode, 
  selectedSuitcaseId, 
  setSelectedSuitcaseId 
}: SuitcaseGridProps) {
  if (suitcases.length === 0) {
    return <div className="text-center py-8">Vous n'avez pas encore de valise.</div>;
  }

  return (
    <div>
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {suitcases.map((suitcase) => (
            <SuitcaseCard
              key={suitcase.id}
              suitcase={suitcase}
              onSelect={() => setSelectedSuitcaseId(suitcase.id)}
              isSelected={selectedSuitcaseId === suitcase.id}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {suitcases.map((suitcase) => (
            <SuitcaseListItem
              key={suitcase.id}
              suitcase={suitcase}
              onSelect={() => setSelectedSuitcaseId(suitcase.id)}
              isSelected={selectedSuitcaseId === suitcase.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
