
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useOutfits } from '@/hooks/useOutfits';
import { useClothes } from '@/hooks/useClothes';
import { Outfit } from '@/core/outfits/domain/types';

const OutfitCreator: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id || null;
  const { createOutfit, addOutfitItem } = useOutfits(userId);
  const clothesQuery = useClothes(userId);
  const [loading, setLoading] = useState(false);
  
  const handleCreateOutfit = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const newOutfit: Partial<Outfit> = {
        user_id: userId,
        name: 'Nouvelle tenue',
        description: '',
        status: 'draft',
        category: 'casual',
        season: 'all',
        is_favorite: false
      };
      
      const outfit = await createOutfit(newOutfit);
      
      // Rediriger vers la page d'édition ou faire autre chose avec la nouvelle tenue
      console.log('Nouvelle tenue créée:', outfit);
      
    } catch (error) {
      console.error('Erreur lors de la création de la tenue:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h2>Créer une nouvelle tenue</h2>
      <button 
        onClick={handleCreateOutfit}
        disabled={loading || !userId}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Création en cours...' : 'Créer une nouvelle tenue'}
      </button>
      
      {clothesQuery.isLoading && <div>Chargement des vêtements...</div>}
      {clothesQuery.isError && <div>Erreur lors du chargement des vêtements</div>}
      {clothesQuery.data && (
        <div className="mt-4">
          <p>{clothesQuery.data.length} vêtements disponibles pour créer une tenue</p>
        </div>
      )}
    </div>
  );
};

export default OutfitCreator;
