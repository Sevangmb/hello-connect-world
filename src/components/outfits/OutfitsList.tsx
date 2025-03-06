import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useOutfits } from '@/hooks/useOutfits';
import { Outfit } from '@/core/outfits/domain/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const OutfitsList: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id || null;
  const { outfits, loading: outfitsLoading, fetchOutfits } = useOutfits();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOutfits();
  }, [fetchOutfits]);

  const handleEditOutfit = (outfitId: string) => {
    navigate(`/outfits/edit/${outfitId}`);
  };

  const handleViewOutfit = (outfitId: string) => {
    navigate(`/outfits/${outfitId}`);
  };

  if (outfitsLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Mes tenues</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (outfits.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Mes tenues</h1>
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Aucune tenue trouvée</h2>
          <p className="text-gray-600 mb-4">
            Vous n'avez pas encore créé de tenues. Commencez par en créer une !
          </p>
          <Button onClick={() => navigate('/outfits/create')}>
            Créer une tenue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mes tenues</h1>
        <Button onClick={() => navigate('/outfits/create')}>
          Créer une tenue
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {outfits.map((outfit: Outfit) => (
          <Card key={outfit.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-w-3 aspect-h-2 relative">
              {outfit.image_url ? (
                <img
                  src={outfit.image_url}
                  alt={outfit.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex justify-center items-center">
                  <span className="text-gray-500">Pas d'image</span>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1">{outfit.name}</h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {outfit.description || "Aucune description"}
              </p>
              
              <div className="flex items-center text-xs text-gray-500 mb-3">
                <span className="mr-3 px-2 py-1 bg-gray-100 rounded-full">
                  {outfit.category}
                </span>
                <span className="px-2 py-1 bg-gray-100 rounded-full">
                  {outfit.season}
                </span>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewOutfit(outfit.id)}
                >
                  Voir
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => handleEditOutfit(outfit.id)}
                >
                  Modifier
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OutfitsList;
