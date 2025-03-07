
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface SuitcaseItemsProps {
  suitcaseId: string;
}

export const SuitcaseItems: React.FC<SuitcaseItemsProps> = ({ suitcaseId }) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchItems = async () => {
      if (!suitcaseId) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('suitcase_items')
          .select(`
            *,
            clothes (
              id,
              name,
              image_url,
              category,
              color
            )
          `)
          .eq('suitcase_id', suitcaseId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setItems(data || []);
      } catch (error) {
        console.error('Error fetching suitcase items:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les vêtements de la valise"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [suitcaseId, toast]);

  const handleAddItems = () => {
    toast({
      title: "Fonction en développement",
      description: "L'ajout de vêtements à la valise sera bientôt disponible.",
    });
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-gray-200 rounded w-full"></div>
        <div className="h-20 bg-gray-200 rounded w-full"></div>
        <div className="h-20 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Aucun vêtement dans cette valise</p>
        <Button onClick={handleAddItems}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter des vêtements
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Vêtements ({items.length})</h3>
        <Button variant="outline" size="sm" onClick={handleAddItems}>
          <Plus className="h-4 w-4 mr-1" />
          Ajouter
        </Button>
      </div>

      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="p-3 bg-gray-50 rounded-md flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              {item.clothes?.image_url ? (
                <img
                  src={item.clothes.image_url}
                  alt={item.clothes.name}
                  className="w-12 h-12 rounded-md object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                  No img
                </div>
              )}
              <div>
                <div className="font-medium">{item.clothes?.name || "Vêtement inconnu"}</div>
                <div className="text-sm text-gray-500">
                  {item.clothes?.category}, {item.quantity} {item.quantity > 1 ? "unités" : "unité"}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${item.is_packed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SuitcaseItems;
