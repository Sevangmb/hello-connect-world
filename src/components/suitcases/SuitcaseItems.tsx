
import React from 'react';
import { useClothes } from '@/hooks/useClothes';
import { Loader2 } from 'lucide-react';

export const SuitcaseItems = () => {
  // Use the hook with properly defined filters
  const { clothes, loading } = useClothes({ showArchived: false });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!clothes?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun vêtement trouvé
      </div>
    );
  }

  return (
    <div>
      {clothes.map((cloth) => (
        <div key={cloth.id}>
          {cloth.name}
        </div>
      ))}
    </div>
  );
};
