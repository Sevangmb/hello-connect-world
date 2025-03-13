
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import MainSidebar from '@/components/MainSidebar';
import { BottomNav } from '@/components/navigation/BottomNav';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Suitcase, SuitcaseItem } from '@/components/suitcases/types';
import { ArrowLeft, Edit, Trash } from 'lucide-react';

const ValiseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [suitcase, setSuitcase] = useState<Suitcase | null>(null);
  const [items, setItems] = useState<SuitcaseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    const fetchSuitcaseDetails = async () => {
      try {
        setLoading(true);
        
        // Récupérer les détails de la valise
        const { data: suitcaseData, error: suitcaseError } = await supabase
          .from('suitcases')
          .select('*')
          .eq('id', id)
          .single();
          
        if (suitcaseError) throw suitcaseError;
        
        setSuitcase(suitcaseData as Suitcase);
        
        // Récupérer les éléments de la valise
        const { data: itemsData, error: itemsError } = await supabase
          .from('suitcase_items')
          .select(`
            *,
            clothes (
              name,
              image_url,
              category,
              color
            )
          `)
          .eq('suitcase_id', id);
          
        if (itemsError) throw itemsError;
        
        setItems(itemsData as SuitcaseItem[]);
      } catch (error) {
        console.error('Erreur lors du chargement des détails de la valise:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les détails de la valise"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSuitcaseDetails();
  }, [id, toast]);

  const handleDelete = async () => {
    if (!suitcase || !confirm('Êtes-vous sûr de vouloir supprimer cette valise ?')) return;
    
    try {
      // Supprimer d'abord les éléments liés à la valise
      const { error: itemsError } = await supabase
        .from('suitcase_items')
        .delete()
        .eq('suitcase_id', suitcase.id);
        
      if (itemsError) throw itemsError;
      
      // Ensuite supprimer la valise elle-même
      const { error } = await supabase
        .from('suitcases')
        .delete()
        .eq('id', suitcase.id);
        
      if (error) throw error;
      
      toast({
        title: "Valise supprimée",
        description: "La valise a été supprimée avec succès"
      });
      
      navigate('/valises');
    } catch (error) {
      console.error('Erreur lors de la suppression de la valise:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la valise"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
        <Header />
        <MainSidebar />
        <main className="pt-24 px-4 md:pl-72">
          <div className="max-w-4xl mx-auto">
            <p>Chargement...</p>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  if (!suitcase) {
    return (
      <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
        <Header />
        <MainSidebar />
        <main className="pt-24 px-4 md:pl-72">
          <div className="max-w-4xl mx-auto">
            <p>Valise non trouvée.</p>
            <Button onClick={() => navigate('/valises')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux valises
            </Button>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button variant="outline" onClick={() => navigate('/valises')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate(`/valises/${id}/edit`)}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h1 className="text-2xl font-bold mb-2">{suitcase.name}</h1>
            {suitcase.description && (
              <p className="text-gray-600 mb-4">{suitcase.description}</p>
            )}
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              {suitcase.destination && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Destination</h3>
                  <p>{suitcase.destination}</p>
                </div>
              )}
              
              {suitcase.start_date && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date de début</h3>
                  <p>{new Date(suitcase.start_date).toLocaleDateString()}</p>
                </div>
              )}
              
              {suitcase.end_date && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date de fin</h3>
                  <p>{new Date(suitcase.end_date).toLocaleDateString()}</p>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Statut</h3>
                <p className="capitalize">{suitcase.status}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Contenu de la valise ({items.length} articles)</h2>
            
            {items.length === 0 ? (
              <p className="text-gray-500">Aucun article dans cette valise.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-200 h-12 w-12 rounded-md flex items-center justify-center">
                        {item.clothes?.image_url ? (
                          <img 
                            src={item.clothes.image_url} 
                            alt={item.clothes.name} 
                            className="h-full w-full object-cover rounded-md"
                          />
                        ) : (
                          <span className="text-gray-400 text-xs">No image</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{item.clothes?.name}</h3>
                        <p className="text-sm text-gray-500">{item.clothes?.category}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-6">
              <Button onClick={() => navigate(`/valises/${id}/add-items`)}>
                Ajouter des articles
              </Button>
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default ValiseDetail;
