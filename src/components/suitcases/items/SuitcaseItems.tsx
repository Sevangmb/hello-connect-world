
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { SuitcaseItem } from '../types';
import { Loader2, Plus, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { SuitcaseItemCard } from './SuitcaseItemCard';
import { AddSuitcaseItemDialog } from './AddSuitcaseItemDialog';

interface SuitcaseItemsProps {
  suitcaseId: string;
}

export const SuitcaseItems: React.FC<SuitcaseItemsProps> = ({ suitcaseId }) => {
  const [items, setItems] = useState<SuitcaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!suitcaseId) return;
    
    const fetchItems = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('suitcase_items')
          .select(`
            *,
            clothes:clothes_id (
              name,
              image_url,
              category,
              color
            )
          `)
          .eq('suitcase_id', suitcaseId);
          
        if (error) throw error;
        setItems(data || []);
      } catch (error) {
        console.error('Error fetching suitcase items:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les éléments de la valise"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchItems();
  }, [suitcaseId, toast]);
  
  const handleAddItem = async (clothesIds: string[]) => {
    if (!suitcaseId || !user) return;
    
    try {
      const itemsToInsert = clothesIds.map(id => ({
        suitcase_id: suitcaseId,
        clothes_id: id,
        quantity: 1
      }));
      
      const { data, error } = await supabase
        .from('suitcase_items')
        .insert(itemsToInsert)
        .select(`
          *,
          clothes:clothes_id (
            name,
            image_url,
            category,
            color
          )
        `);
        
      if (error) throw error;
      
      setItems(prev => [...prev, ...(data || [])]);
      setDialogOpen(false);
      
      toast({
        title: "Articles ajoutés",
        description: `${clothesIds.length} article(s) ajouté(s) à la valise`
      });
    } catch (error) {
      console.error('Error adding items to suitcase:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter les articles à la valise"
      });
    }
  };
  
  const handleRemoveItem = async (itemId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir retirer cet article de la valise ?')) return;
    
    try {
      const { error } = await supabase
        .from('suitcase_items')
        .delete()
        .eq('id', itemId);
        
      if (error) throw error;
      
      setItems(prev => prev.filter(item => item.id !== itemId));
      
      toast({
        title: "Article retiré",
        description: "L'article a été retiré de la valise"
      });
    } catch (error) {
      console.error('Error removing item from suitcase:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de retirer l'article de la valise"
      });
    }
  };
  
  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      const { error } = await supabase
        .from('suitcase_items')
        .update({ quantity: newQuantity })
        .eq('id', itemId);
        
      if (error) throw error;
      
      setItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    } catch (error) {
      console.error('Error updating item quantity:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour la quantité"
      });
    }
  };
  
  const filteredItems = items.filter(item => 
    item.clothes?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.clothes?.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.clothes?.color?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Rechercher..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-8"
          />
          {searchTerm && (
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() => setSearchTerm('')}
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>
        
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </div>
      
      {filteredItems.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Aucun article trouvé</h3>
          <p className="text-gray-500 mb-4">
            {items.length === 0 
              ? "Votre valise est vide. Ajoutez des articles pour commencer à préparer votre voyage."
              : "Aucun article ne correspond à votre recherche."}
          </p>
          {items.length === 0 && (
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter des articles
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <SuitcaseItemCard
              key={item.id}
              item={item}
              onRemove={() => handleRemoveItem(item.id)}
              onUpdateQuantity={(quantity) => updateQuantity(item.id, quantity)}
            />
          ))}
        </div>
      )}
      
      <AddSuitcaseItemDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAdd={handleAddItem}
        existingItemIds={items.map(item => item.clothes_id)}
      />
    </div>
  );
};
