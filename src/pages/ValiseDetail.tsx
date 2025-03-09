import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Map, Edit, Trash, Plus, ShoppingBag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/modules/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

const ValiseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [suitcase, setSuitcase] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('items');

  useEffect(() => {
    if (!id) {
      navigate('/valises');
      return;
    }
    
    const fetchSuitcase = async () => {
      if (!user) {
        console.log('Utilisateur non connecté, redirection vers la page de connexion');
        // Si l'utilisateur n'est pas connecté, ne pas charger les données
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Chargement de la valise:', id);
        
        // Charger les informations de la valise
        const { data, error } = await supabase
          .from('suitcases')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Erreur lors du chargement de la valise:', error);
          throw error;
        }
        
        console.log('Valise récupérée:', data);
        setSuitcase(data);
        
        // Charger les éléments de la valise
        const { data: itemsData, error: itemsError } = await supabase
          .from('suitcase_items')
          .select(`
            *,
            clothes (
              id,
              name,
              image_url,
              category,
              color,
              brand
            )
          `)
          .eq('suitcase_id', id);
          
        if (itemsError) {
          console.error('Erreur lors du chargement des éléments:', itemsError);
          throw itemsError;
        }
        
        console.log('Éléments récupérés:', itemsData?.length || 0);
        setItems(itemsData || []);
      } catch (error) {
        console.error('Erreur lors du chargement de la valise:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les informations de la valise"
        });
        navigate('/valises');
      } finally {
        setLoading(false);
      }
    };

    fetchSuitcase();
  }, [id, user, toast, navigate]);

  const handleDelete = async () => {
    if (!id || !user) return;
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette valise ?")) return;

    try {
      // Supprimer les éléments de la valise
      const { error: itemsError } = await supabase
        .from('suitcase_items')
        .delete()
        .eq('suitcase_id', id);
      
      if (itemsError) throw itemsError;
      
      // Supprimer la valise
      const { error } = await supabase
        .from('suitcases')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
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

  const addClothesToSuitcase = () => {
    // Cette fonctionnalité sera développée ultérieurement
    toast({
      title: "Fonctionnalité à venir",
      description: "L'ajout de vêtements à une valise sera bientôt disponible."
    });
  };

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <Button 
        variant="outline" 
        className="mb-4"
        onClick={() => navigate('/valises')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour à mes valises
      </Button>
      
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="h-64 w-full mt-6" />
        </div>
      ) : !suitcase ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg border">
          <h2 className="text-xl font-semibold text-red-600">Valise non trouvée</h2>
          <p className="mt-2 mb-4">Cette valise n'existe pas ou vous n'avez pas les droits pour y accéder.</p>
          <Button onClick={() => navigate('/valises')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à mes valises
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold mb-2">{suitcase.name}</h1>
                {suitcase.description && (
                  <p className="text-muted-foreground mb-4">{suitcase.description}</p>
                )}
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {(suitcase.start_date && suitcase.end_date) && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {format(new Date(suitcase.start_date), 'PPP', { locale: fr })} - 
                        {format(new Date(suitcase.end_date), 'PPP', { locale: fr })}
                      </span>
                    </div>
                  )}
                  
                  {suitcase.destination && (
                    <div className="flex items-center">
                      <Map className="h-4 w-4 mr-2" />
                      <span>{suitcase.destination}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate(`/valises/edit/${id}`)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                  <Trash className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="px-6 pb-6">
            <TabsList className="mt-4 mb-4">
              <TabsTrigger value="items">Vêtements</TabsTrigger>
              <TabsTrigger value="outfits">Tenues</TabsTrigger>
              <TabsTrigger value="calendar">Calendrier</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="items">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Vêtements dans la valise</h2>
                <Button onClick={addClothesToSuitcase} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter des vêtements
                </Button>
              </div>
              
              {items.length === 0 ? (
                <Card className="bg-muted/30">
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <ShoppingBag className="h-10 w-10 text-muted-foreground/60 mb-4" />
                    <p className="text-muted-foreground text-center">
                      Aucun vêtement n'a encore été ajouté à cette valise.
                      <br />
                      Cliquez sur "Ajouter des vêtements" pour commencer à préparer votre valise.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {items.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="flex h-24">
                        <div className="w-24 h-full bg-muted flex-shrink-0">
                          {item.clothes?.image_url ? (
                            <img
                              src={item.clothes.image_url}
                              alt={item.clothes.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                              <ShoppingBag className="h-8 w-8 text-muted-foreground/40" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 p-3 flex flex-col justify-between">
                          <div>
                            <h3 className="font-medium line-clamp-1">{item.clothes?.name}</h3>
                            <div className="flex items-center mt-1">
                              <Badge variant="outline" className="text-xs">
                                {item.clothes?.category}
                              </Badge>
                              {item.clothes?.color && (
                                <span className="text-xs text-muted-foreground ml-2">
                                  {item.clothes.color}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>{item.clothes?.brand || 'Sans marque'}</span>
                            <span>Quantité: {item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="outfits">
              <div className="text-center py-10">
                <p className="text-muted-foreground">
                  La fonctionnalité des tenues sera bientôt disponible.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="calendar">
              <div className="text-center py-10">
                <p className="text-muted-foreground">
                  Le calendrier de vos tenues sera bientôt disponible.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="notes">
              <div className="text-center py-10">
                <p className="text-muted-foreground">
                  Les notes de voyage seront bientôt disponibles.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default ValiseDetail;
