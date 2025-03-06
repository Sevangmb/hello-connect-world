import { useState, useEffect } from 'react';
import { useClothes } from '@/hooks/useClothes';

export const useSuitcaseSuggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Use the hook with properly defined filters
  const { clothes, loading: clothesLoading } = useClothes({});

  useEffect(() => {
    if (clothes && clothes.length > 0) {
      // Basic logic to create suggestions (can be improved)
      const suggestedItems = clothes.slice(0, 5);
      setSuggestions(suggestedItems);
    }
  }, [clothes]);

  return {
    suggestions,
    loading: loading || clothesLoading,
  };
};
