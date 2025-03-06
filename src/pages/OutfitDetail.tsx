
import React from 'react';
import { useParams } from 'react-router-dom';
import { ModuleGuard } from '@/components/modules/ModuleGuard';

// Page de détail d'une tenue
// Cette page sera implémentée plus tard
const OutfitDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <ModuleGuard moduleCode="outfits">
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Détail de la tenue: {id}</h1>
        <p>Cette page est en cours de développement.</p>
      </div>
    </ModuleGuard>
  );
};

export default OutfitDetailPage;
