
import React, { useEffect, useState } from 'react';
import { useSuitcaseCalendarItems } from '@/hooks/useSuitcaseCalendarItems';
import { SuitcaseCalendarItem } from '@/components/suitcases/utils/types';
import { Loader2 } from 'lucide-react';

export interface SuitcaseCalendarItemsListProps {
  suitcaseId: string;
  date: string;
  onItemsChanged: () => void;
}

export const SuitcaseCalendarItemsList: React.FC<SuitcaseCalendarItemsListProps> = ({ 
  suitcaseId, 
  date,
  onItemsChanged 
}) => {
  const { items, loading } = useSuitcaseCalendarItems(suitcaseId, date);
  
  useEffect(() => {
    if (!loading) {
      onItemsChanged();
    }
  }, [items, loading, onItemsChanged]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!items?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun élément pour cette date
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="p-3 border rounded-md">
          <div className="font-medium">{item.clothes?.name || 'Vêtement sans nom'}</div>
          <div className="text-sm text-gray-500">Quantité: {item.quantity}</div>
        </div>
      ))}
    </div>
  );
};
