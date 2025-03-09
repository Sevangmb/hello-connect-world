
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Search, X } from 'lucide-react';
import { ClothesItem } from '@/components/clothes/types';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AddSuitcaseItemDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (clothesIds: string[]) => void;
  existingItemIds: string[];
}

export const AddSuitcaseItemDialog: React.FC<AddSuitcaseItemDialogProps> = ({
  open,
  onClose,
  onAdd,
  existingItemIds
}) => {
  const [clothes, setClothes] = useState<ClothesItem[]>([]);
  const [filteredClothes, setFilteredClothes] = useState<ClothesItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const { user } = useAuth();

  useEffect(() => {
    if (!open || !user) return;

    const fetchClothes = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('clothes')
          .select('*')
          .eq('user_id', user.id)
          .eq('archived', false)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        const availableClothes = (data || []).filter(
          item => !existingItemIds.includes(item.id)
        );
        
        setClothes(availableClothes);
        setFilteredClothes(availableClothes);
      } catch (error) {
        console.error('Error fetching clothes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClothes();
  }, [open, user, existingItemIds]);

  useEffect(() => {
    let filtered = [...clothes];
    
    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(item => item.category === activeCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        (item.name?.toLowerCase().includes(term)) ||
        (item.description?.toLowerCase().includes(term)) ||
        (item.color?.toLowerCase().includes(term)) ||
        (item.brand?.toLowerCase().includes(term))
      );
    }
    
    setFilteredClothes(filtered);
  }, [clothes, searchTerm, activeCategory]);

  const handleSelectClothes = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const handleAddSelected = () => {
    if (selectedIds.length > 0) {
      onAdd(selectedIds);
    }
  };

  const getAvailableCategories = () => {
    const categories = new Set<string>();
    clothes.forEach(item => {
      if (item.category) categories.add(item.category);
    });
    return Array.from(categories);
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Ajouter des vêtements à la valise</DialogTitle>
        </DialogHeader>
        
        <div className="relative w-full mb-4">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Rechercher des vêtements..." 
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
        
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="flex-1">
            <TabsList className="mb-4 flex-wrap">
              <TabsTrigger value="all">Tous</TabsTrigger>
              {getAvailableCategories().map(category => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value={activeCategory} className="mt-0 flex-1">
              {filteredClothes.length === 0 ? (
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Aucun vêtement trouvé</h3>
                  <p className="text-gray-500">
                    {clothes.length === 0 
                      ? "Vous n'avez pas encore ajouté de vêtements à votre garde-robe."
                      : "Aucun vêtement ne correspond à votre recherche ou à cette catégorie."}
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-2">
                    {filteredClothes.map((item) => (
                      <div 
                        key={item.id} 
                        className="flex items-center space-x-3 p-2 rounded-md hover:bg-slate-100"
                      >
                        <Checkbox 
                          id={`check-${item.id}`}
                          checked={selectedIds.includes(item.id)}
                          onCheckedChange={() => handleSelectClothes(item.id)}
                        />
                        
                        <div className="h-12 w-12 rounded-md bg-gray-100 overflow-hidden flex-shrink-0">
                          {item.image_url ? (
                            <img 
                              src={item.image_url} 
                              alt={item.name} 
                              className="h-full w-full object-cover"
                            />
                          ) : null}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <label
                            htmlFor={`check-${item.id}`}
                            className="text-sm font-medium cursor-pointer"
                          >
                            {item.name}
                          </label>
                          <p className="text-xs text-gray-500 truncate">
                            {item.category} 
                            {item.color ? ` • ${item.color}` : ''}
                            {item.brand ? ` • ${item.brand}` : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>
          </Tabs>
        )}
        
        <DialogFooter className="flex justify-between items-center mt-4 pt-4 border-t">
          <div className="text-sm text-gray-500">
            {selectedIds.length} élément(s) sélectionné(s)
            {selectedIds.length > 0 && (
              <Button 
                variant="link" 
                className="p-0 h-auto ml-2" 
                onClick={handleClearSelection}
              >
                Effacer
              </Button>
            )}
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              onClick={handleAddSelected} 
              disabled={selectedIds.length === 0}
            >
              Ajouter à la valise
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
