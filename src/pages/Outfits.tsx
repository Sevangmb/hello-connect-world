
import React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import OutfitsList from '@/components/outfits/OutfitsList';
import CreateOutfit from '@/components/outfits/CreateOutfit';

const Outfits = () => {
  const [showCreateOutfit, setShowCreateOutfit] = useState(false);

  return (
    <div className="container max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mes tenues</h1>
        <Button onClick={() => setShowCreateOutfit(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Créer une tenue
        </Button>
      </div>
      
      <OutfitsList />
      
      <CreateOutfit 
        isOpen={showCreateOutfit} 
        onClose={() => setShowCreateOutfit(false)} 
      />
    </div>
  );
};

export default Outfits;
