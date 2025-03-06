
import React, { useEffect, useState } from 'react';
import { useClothes } from '@/hooks/useClothes';
import { useSuitcaseItems } from '@/hooks/useSuitcaseItems';
import { SuitcaseItemsEmpty } from './SuitcaseItemsEmpty';
import { SuitcaseItemsHeader } from './SuitcaseItemsHeader';

interface SuitcaseItemsProps {
  suitcaseId: string;
}

export const SuitcaseItems: React.FC<SuitcaseItemsProps> = ({ suitcaseId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { clothes } = useClothes();
  const { data: items = [], refetch: fetchItems, remove: removeItem } = useSuitcaseItems(suitcaseId);
  
  useEffect(() => {
    const loadItems = async () => {
      setIsLoading(true);
      await fetchItems();
      setIsLoading(false);
    };
    
    loadItems();
  }, [suitcaseId, fetchItems]);
  
  const handleRemoveItem = async (itemId: string) => {
    await removeItem(itemId);
  };
  
  // If there are no items, show empty state
  if (!isLoading && items.length === 0) {
    return <SuitcaseItemsEmpty suitcaseId={suitcaseId} />;
  }
  
  return (
    <div className="space-y-3">
      <SuitcaseItemsHeader count={items.length} isLoading={isLoading} />
      
      {isLoading ? (
        <div className="animate-pulse space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded-md" />
          ))}
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => {
            const clothe = clothes.find(c => c.id === item.clothes_id);
            return clothe ? (
              <li key={item.id} className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center gap-2">
                  {clothe.image_url && (
                    <div className="h-8 w-8 rounded-md overflow-hidden">
                      <img 
                        src={clothe.image_url} 
                        alt={clothe.name || 'Vêtement'} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <span className="text-sm font-medium">{clothe.name || clothe.category}</span>
                </div>
                <button 
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Retirer
                </button>
              </li>
            ) : null;
          })}
        </ul>
      )}
    </div>
  );
};
