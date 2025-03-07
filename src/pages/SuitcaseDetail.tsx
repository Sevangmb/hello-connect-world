
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Edit, List, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { SuitcaseHeader } from '@/components/suitcases/components/SuitcaseHeader';
import { SuitcaseItems } from '@/components/suitcases/items/SuitcaseItems';
import { SuitcaseCalendar } from '@/components/suitcases/components/SuitcaseCalendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SuitcaseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [suitcase, setSuitcase] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState('items');

  useEffect(() => {
    const fetchSuitcase = async () => {
      if (!id) return;

      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('suitcases')
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
        setSuitcase(data);
      } catch (error) {
        console.error('Error fetching suitcase:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les informations de la valise"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSuitcase();
  }, [id, toast]);

  const handleDelete = async () => {
    if (!id || !user) return;

    try {
      setDeleting(true);
      
      // Vérifier que l'utilisateur est le propriétaire
      if (suitcase.user_id !== user.id) {
        throw new Error("Vous n'êtes pas autorisé à supprimer cette valise");
      }
      
      // Supprimer les relations avec les vêtements
      const { error: itemsError } = await supabase
        .from('suitcase_items')
        .delete()
        .eq('suitcase_id', id);
      
      if (itemsError) throw itemsError;
      
      // Supprimer la valise
      const { error } = await supabase
        .from('suitcases')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Valise supprimée",
        description: "La valise a été supprimée avec succès"
      });
      
      navigate('/wardrobe/suitcases');
    } catch (error: any) {
      console.error('Error deleting suitcase:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la suppression de la valise"
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

  const isOwner = user && suitcase?.user_id === user.id;

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <Button 
        variant="outline" 
        className="mb-4"
        onClick={() => navigate('/wardrobe/suitcases')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour aux valises
      </Button>
      
      {suitcase ? (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <SuitcaseHeader 
              suitcase={suitcase} 
              isOwner={isOwner}
              onDelete={() => setShowDeleteDialog(true)}
            />
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="px-6 pb-6">
              <TabsList className="mb-4">
                <TabsTrigger value="items">
                  <List className="h-4 w-4 mr-2" />
                  Vêtements
                </TabsTrigger>
                <TabsTrigger value="calendar">
                  <Calendar className="h-4 w-4 mr-2" />
                  Calendrier
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="items">
                <SuitcaseItems suitcaseId={id || ''} isOwner={isOwner} />
              </TabsContent>
              
              <TabsContent value="calendar">
                <SuitcaseCalendar 
                  startDate={suitcase.start_date} 
                  endDate={suitcase.end_date}
                  suitcaseId={id || ''}
                />
              </TabsContent>
            </Tabs>
          </div>
          
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Supprimer la valise</DialogTitle>
                <DialogDescription>
                  Êtes-vous sûr de vouloir supprimer cette valise ? Cette action est irréversible.
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
          <h2 className="text-xl font-semibold text-gray-700">Valise non trouvée</h2>
          <p className="mt-2 text-gray-500">Cette valise n'existe pas ou a été supprimée.</p>
          <Button 
            className="mt-4"
            onClick={() => navigate('/wardrobe/suitcases')}
          >
            Voir toutes mes valises
          </Button>
        </div>
      )}
    </div>
  );
};

export default SuitcaseDetail;
