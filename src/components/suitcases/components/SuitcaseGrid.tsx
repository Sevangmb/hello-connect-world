
import React from 'react';
import SuitcaseCard from './SuitcaseCard';
import SuitcaseListItem from './SuitcaseListItem';

interface SuitcaseGridProps {
  suitcases: any[];
  viewMode: 'grid' | 'list';
  selectedSuitcaseId: string;
  setSelectedSuitcaseId: (id: string) => void;
}

const SuitcaseGrid: React.FC<SuitcaseGridProps> = ({ 
  suitcases, 
  viewMode,
  selectedSuitcaseId,
  setSelectedSuitcaseId
}) => {
  if (!suitcases.length) {
    return (
      <div className="border rounded-md p-8 text-center">
        <p className="text-muted-foreground">Vous n'avez pas encore de valise</p>
      </div>
    );
  }

  return (
    <div>
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {suitcases.map((suitcase) => (
            <SuitcaseCard
              key={suitcase.id}
              suitcase={suitcase}
              isSelected={suitcase.id === selectedSuitcaseId}
              onClick={() => setSelectedSuitcaseId(suitcase.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col space-y-2">
          {suitcases.map((suitcase) => (
            <SuitcaseListItem
              key={suitcase.id}
              suitcase={suitcase}
              isSelected={suitcase.id === selectedSuitcaseId}
              onClick={() => setSelectedSuitcaseId(suitcase.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SuitcaseGrid;
