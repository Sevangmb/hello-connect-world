
import React from 'react';
import { Card } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';
import { SuitcaseListItemProps } from './SuitcaseListItem';

export const SuitcaseCard = ({ suitcase, onSelect }: SuitcaseListItemProps) => {
  return (
    <Card
      className="p-4 cursor-pointer hover:bg-gray-50"
      onClick={() => onSelect(suitcase.id)}
    >
      <div className="flex items-center gap-3">
        <Briefcase className="h-5 w-5 text-gray-500" />
        <div>
          <h3 className="font-medium">{suitcase.name}</h3>
          {suitcase.description && (
            <p className="text-sm text-gray-500">{suitcase.description}</p>
          )}
        </div>
      </div>
    </Card>
  );
};
