
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/modules/auth';
import { Search, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

interface AddSuitcaseItemDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (clothesIds: string[]) => void;
  existingItemIds?: string[];
}

export const AddSuitcaseItemDialog: React.FC<AddSuitcaseItemDialogProps> = ({
  open,
  onClose,
  onAdd,
  existingItemIds = []
}) => {
  const [clothes, setClothes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (open && user) {
      fetchClothes();
    }
  }, [open, user]);
  
  const fetchClothes = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clothes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setClothes(data || []);
    } catch (error) {
      console.error('Error fetching clothes:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger vos vêtements"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };
  
  const handleAdd = () => {
    if (selectedIds.length === 0) {
      toast({
        variant: "destructive",
        title: "Sélection vide",
        description: "Veuillez sélectionner au moins un article"
      });
      return;
    }
    
    onAdd(selectedIds);
  };
  
  const handleClose = () => {
    setSelectedIds([]);
    setSearchTerm('');
    onClose();
  };
  
  const filteredClothes = clothes.filter(item => 
    !existingItemIds.includes(item.id) && 
    (searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.color?.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Ajouter des vêtements à la valise</DialogTitle>
        </DialogHeader>
        
        <div className="relative mb-4">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        {loading ? (
          <div className="text-center py-8">Chargement de vos vêtements...</div>
        ) : filteredClothes.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground/60 mb-3" />
            <p className="text-muted-foreground mb-2">
              {clothes.length === 0 
                ? "Vous n'avez pas encore ajouté de vêtements dans votre garde-robe."
                : "Aucun vêtement ne correspond à votre recherche ou tous vos vêtements sont déjà dans la valise."}
            </p>
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto space-y-1 border rounded-md p-2">
            {filteredClothes.map(item => (
              <div
                key={item.id}
                className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md"
              >
                <Checkbox
                  id={`select-${item.id}`}
                  checked={selectedIds.includes(item.id)}
                  onCheckedChange={() => handleSelect(item.id)}
                />
                <div 
                  className="flex-grow flex items-center cursor-pointer"
                  onClick={() => handleSelect(item.id)}
                >
                  <div className="h-10 w-10 bg-muted rounded-md mr-3 flex-shrink-0 overflow-hidden">
                    {item.image_url ? (
                      <img 
                        src={item.image_url} 
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <ShoppingBag className="h-5 w-5 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {item.category || 'Non catégorisé'}
                      </Badge>
                      {item.color && (
                        <span className="text-xs text-muted-foreground">{item.color}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <DialogFooter>
          <div className="flex justify-between items-center w-full">
            <span className="text-sm text-muted-foreground">
              {selectedIds.length} article(s) sélectionné(s)
            </span>
            <div className="space-x-2">
              <Button variant="outline" onClick={handleClose}>
                Annuler
              </Button>
              <Button onClick={handleAdd} disabled={selectedIds.length === 0}>
                Ajouter à la valise
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
