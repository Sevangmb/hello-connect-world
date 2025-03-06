
import React, { useEffect, useState } from 'react';
import { useOutfits } from '@/hooks/useOutfits';
import { Outfit } from '@/core/outfits/domain/types';

interface OutfitsListProps {
  userId?: string;
  filter?: 'all' | 'favorites' | 'recent';
}

const OutfitsList: React.FC<OutfitsListProps> = ({ userId, filter = 'all' }) => {
  const { outfits, loading, error, fetchUserOutfits, fetchOutfits } = useOutfits();
  const [filteredOutfits, setFilteredOutfits] = useState<Outfit[]>([]);

  useEffect(() => {
    const loadOutfits = async () => {
      if (userId) {
        await fetchUserOutfits(userId);
      } else {
        await fetchOutfits();
      }
    };
    
    loadOutfits();
  }, [userId, filter]);

  useEffect(() => {
    if (filter === 'favorites') {
      setFilteredOutfits(outfits.filter(outfit => outfit.is_favorite));
    } else if (filter === 'recent') {
      setFilteredOutfits([...outfits].sort((a, b) => {
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      }).slice(0, 5));
    } else {
      setFilteredOutfits(outfits);
    }
  }, [outfits, filter]);

  if (loading) return <div>Loading outfits...</div>;
  if (error) return <div>Error loading outfits: {error.message}</div>;
  if (filteredOutfits.length === 0) return <div>No outfits found.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {filteredOutfits.map(outfit => (
        <div key={outfit.id} className="border rounded-lg p-4">
          <h3 className="font-semibold">{outfit.name}</h3>
          <p className="text-sm text-gray-600">{outfit.description}</p>
          <div className="mt-2 flex justify-between items-center">
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {outfit.category}
            </span>
            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
              {outfit.season}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OutfitsList;
