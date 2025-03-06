
import React from 'react';
import { useSuitcases } from '@/hooks/useSuitcases';
import { useSuitcaseItems } from '@/hooks/useSuitcaseItems';
import { Loader2 } from 'lucide-react';
import { useParams } from 'react-router-dom';

export const SuitcaseItems = () => {
  const { id } = useParams<{ id: string }>();
  const { getSuitcaseById, loading: suitcaseLoading } = useSuitcases();
  const { items, loading: itemsLoading } = useSuitcaseItems(id || '');
  
  const suitcase = id ? getSuitcaseById(id) : null;
  const loading = suitcaseLoading || itemsLoading;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!suitcase) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Valise introuvable
      </div>
    );
  }

  if (!items?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun vêtement dans cette valise
      </div>
    );
  }

  return (
    <div>
      {items.map((item) => (
        <div key={item.id} className="p-3 border rounded-md mb-2">
          <div className="font-medium">{item.clothes?.name || 'Vêtement sans nom'}</div>
          <div className="text-sm text-gray-500">Quantité: {item.quantity}</div>
        </div>
      ))}
    </div>
  );
};
