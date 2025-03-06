import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { SuitcaseItemsEmpty } from './SuitcaseItemsEmpty';
import { SuitcaseItemsHeader } from './SuitcaseItemsHeader';
import { useSuitcaseItems } from '@/hooks/useSuitcaseItems';

interface SuitcaseItemsProps {
  suitcaseId: string;
}

export const SuitcaseItems: React.FC<SuitcaseItemsProps> = ({ suitcaseId }) => {
  const { data: items, isLoading, remove } = useSuitcaseItems(suitcaseId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!items?.length) {
    return (
      <SuitcaseItemsEmpty 
        suitcaseId={suitcaseId}
        availableClothes={[]} 
      />
    );
  }

  return (
    <div>
      <SuitcaseItemsHeader 
        itemCount={items.length} 
        isLoading={isLoading} 
      />
      <ul className="space-y-2 mt-2">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between items-center p-2 border rounded-md">
            <span>{item.name}</span>
            <button 
              onClick={() => remove && remove(item.id)}
              className="text-red-500 text-sm"
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
