
import React from 'react';
import { useSuitcase } from '@/hooks/useSuitcase';
import { useSuitcaseItems } from '@/hooks/useSuitcaseItems';
import { Loader2 } from 'lucide-react';

interface SuitcaseItemsProps {
  suitcaseId: string;
  onBack?: () => void;
}

export const SuitcaseItems: React.FC<SuitcaseItemsProps> = ({ suitcaseId, onBack }) => {
  const { data: suitcase, isLoading: suitcaseLoading } = useSuitcase(suitcaseId);
  const { data: suitcaseItems, isLoading: itemsLoading } = useSuitcaseItems(suitcaseId);
  
  const isLoading = suitcaseLoading || itemsLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!suitcaseItems?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun vêtement trouvé dans cette valise
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{suitcase?.name}</h2>
      <div className="space-y-2">
        {suitcaseItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-2 bg-card rounded-md border">
            <div className="flex items-center">
              {item.clothes?.image_url && (
                <img 
                  src={item.clothes.image_url} 
                  alt={item.clothes?.name} 
                  className="w-10 h-10 object-cover rounded-md mr-3"
                />
              )}
              <div>
                <p className="font-medium">{item.clothes?.name || 'Vêtement inconnu'}</p>
                <p className="text-sm text-muted-foreground">Quantité: {item.quantity}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {onBack && (
        <button 
          onClick={onBack}
          className="mt-4 px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-md"
        >
          Retour à la valise
        </button>
      )}
    </div>
  );
}
