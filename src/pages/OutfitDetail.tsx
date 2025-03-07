
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash } from 'lucide-react';
import { OutfitInteractions } from '@/components/outfits/OutfitInteractions';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';

const OutfitDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [outfit, setOutfit] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchOutfit = async () => {
      if (!id) return;

      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('outfits')
          .select(`
            *,
            profiles (
              id,
              username,
              avatar_url
            )
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        setOutfit(data);

        // Charger les vêtements associés à cette tenue
        const { data: itemsData, error: itemsError } = await supabase
          .from('outfit_items')
          .select(`
            *,
            clothes (
              id,
              name,
              image_url,
              category
            )
          `)
          .eq('outfit_id', id);

        if (itemsError) throw itemsError;
        setItems(itemsData || []);
      } catch (error) {
        console.error('Error fetching outfit:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les informations de la tenue"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOutfit();
  }, [id, toast]);

  const handleDelete = async () => {
    if (!id || !user) return;

    try {
      setDeleting(true);
      
      // Vérifier que l'utilisateur est le propriétaire
      if (outfit.user_id !== user.id) {
        throw new Error("Vous n'êtes pas autorisé à supprimer cette tenue");
      }
      
      // Supprimer les relations avec les vêtements
      const { error: itemsError } = await supabase
        .from('outfit_items')
        .delete()
        .eq('outfit_id', id);
      
      if (itemsError) throw itemsError;
      
      // Supprimer la tenue
      const { error } = await supabase
        .from('outfits')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Tenue supprimée",
        description: "La tenue a été supprimée avec succès"
      });
      
      navigate('/wardrobe/outfits');
    } catch (error: any) {
      console.error('Error deleting outfit:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la suppression de la tenue"
      });
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto p-4">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-gray-200 rounded w-3/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const isOwner = user && outfit?.user_id === user.id;

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <Button 
        variant="outline" 
        className="mb-4"
        onClick={() => navigate('/wardrobe/outfits')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour aux tenues
      </Button>
      
      {outfit ? (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold">{outfit.name}</h1>
                
                {isOwner && (
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/wardrobe/outfits/edit/${id}`)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                    
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Supprimer
                    </Button>
                  </div>
                )}
              </div>
              
              <p className="text-gray-600 mt-2">{outfit.description}</p>
              
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-3">Composants de la tenue</h2>
                {items.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {items.map((item) => (
                      <div key={item.id} className="bg-gray-50 rounded-md p-2">
                        <div className="aspect-square relative overflow-hidden rounded-md mb-2">
                          <img 
                            src={item.clothes?.image_url || '/placeholder.svg'} 
                            alt={item.clothes?.name} 
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-sm font-medium">{item.clothes?.name}</p>
                        <p className="text-xs text-gray-500">{item.clothes?.category}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Aucun vêtement associé à cette tenue</p>
                )}
              </div>
            </div>
            
            <div className="border-t p-4">
              <OutfitInteractions outfit={outfit} />
            </div>
          </div>
          
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Supprimer la tenue</DialogTitle>
                <DialogDescription>
                  Êtes-vous sûr de vouloir supprimer cette tenue ? Cette action est irréversible.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeleteDialog(false)}
                  disabled={deleting}
                >
                  Annuler
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? 'Suppression...' : 'Supprimer'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700">Tenue non trouvée</h2>
          <p className="mt-2 text-gray-500">Cette tenue n'existe pas ou a été supprimée.</p>
          <Button 
            className="mt-4"
            onClick={() => navigate('/wardrobe/outfits')}
          >
            Voir toutes mes tenues
          </Button>
        </div>
      )}
    </div>
  );
};

export default OutfitDetail;
