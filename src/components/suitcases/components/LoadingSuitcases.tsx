
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const LoadingSuitcases = () => {
  // Créer un tableau d'éléments de chargement
  const loadingItems = Array.from({ length: 6 }, (_, i) => (
    <div key={i} className="bg-card rounded-lg overflow-hidden border shadow-sm">
      <div className="relative">
        <Skeleton className="w-full h-40" />
      </div>
      <div className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-3" />
        <div className="flex justify-between">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  ));

  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loadingItems}
      </div>
    </div>
  );
};
