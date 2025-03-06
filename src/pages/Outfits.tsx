
import React from 'react';
import { useParams } from 'react-router-dom';
import OutfitsList from '@/components/outfits/OutfitsList';
import OutfitCreator from '@/components/outfits/OutfitCreator';
import { ModuleGuard } from '@/components/modules/ModuleGuard';

// Page principale pour la gestion des tenues
const OutfitsPage: React.FC = () => {
  const { action } = useParams<{ action?: string }>();
  
  return (
    <ModuleGuard moduleCode="outfits">
      {action === 'create' ? (
        <OutfitCreator />
      ) : (
        <OutfitsList />
      )}
    </ModuleGuard>
  );
};

export default OutfitsPage;
