import React, { useState, useEffect } from 'react';
import { SuitcaseList } from '@/components/suitcases/components/SuitcaseList';
import { CreateSuitcaseDialog } from '@/components/suitcases/components/CreateSuitcaseDialog';
import { Button } from '@/components/ui/button';
import { Plus, Luggage } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Header } from '@/components/Header';
import MainSidebar from '@/components/MainSidebar';
import { BottomNav } from '@/components/navigation/BottomNav';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/modules/auth';
import { SuitcaseStatus, SuitcaseWithStats } from '@/components/suitcases/types';

const Valises = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [suitcases, setSuitcases] = useState<SuitcaseWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    const fetchSuitcases = async () => {
      try {
        setLoading(true);
        console.log('Chargement des valises pour l\'utilisateur:', user.id);
        
        const { data, error } = await supabase
          .from('suitcases')
          .select(`
            *,
            suitcase_items (id)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        // Transformer les données pour inclure le nombre d'articles
        const suitcasesWithStats = (data || []).map((suitcase: any) => ({
          ...suitcase,
          item_count: suitcase.suitcase_items?.length || 0
        }));
        
        console.log('Valises récupérées:', suitcasesWithStats.length || 0);
        setSuitcases(suitcasesWithStats);
      } catch (error) {
        console.error('Erreur lors du chargement des valises:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger vos valises. Veuillez réessayer."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSuitcases();
  }, [user, toast]);

  const handleEditSuitcase = (id: string) => {
    window.location.href = `/valises/${id}`;
  };

  const handleDeleteSuitcase = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette valise ?")) return;
    
    try {
      // Supprimer d'abord les éléments liés à la valise
      const { error: itemsError } = await supabase
        .from('suitcase_items')
        .delete()
        .eq('suitcase_id', id);
        
      if (itemsError) throw itemsError;
      
      // Ensuite supprimer la valise elle-même
      const { error } = await supabase
        .from('suitcases')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Mettre à jour la liste des valises
      setSuitcases(suitcases.filter(s => s.id !== id));
      
      toast({
        title: "Valise supprimée",
        description: "La valise a été supprimée avec succès"
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de la valise:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la valise. Veuillez réessayer."
      });
    }
  };

  const handleCreateSuitcase = async (values: any) => {
    try {
      if (!user) throw new Error("Vous devez être connecté pour créer une valise");
      
      // Créer la nouvelle valise avec un statut compatible avec la base de données
      const newSuitcase = {
        user_id: user.id,
        name: values.name,
        description: values.description || null,
        destination: values.destination || null,
        start_date: values.startDate || null,
        end_date: values.endDate || null,
        status: "active" as SuitcaseStatus // Seule valeur acceptée: 'active' ou 'archived'
      };
      
      const { data, error } = await supabase
        .from('suitcases')
        .insert(newSuitcase)
        .select();
        
      if (error) throw error;
      
      console.log('Nouvelle valise créée:', data[0]);
      
      // Ajouter la nouvelle valise à la liste avec un comptage d'articles à 0
      const newSuitcaseWithStats = {
        ...data[0],
        item_count: 0
      };
      
      setSuitcases([newSuitcaseWithStats, ...suitcases]);
      
      toast({
        title: "Valise créée",
        description: "Votre nouvelle valise a été créée avec succès"
      });
      
      setShowCreateDialog(false);
    } catch (error: any) {
      console.error('Erreur lors de la création de la valise:', error);
      toast({
        variant: "destructive",
        title: "Erreur", 
        description: error.message || "Une erreur est survenue lors de la création de la valise"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Mes valises</h1>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Créer une valise
            </Button>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-3" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                  <div className="border-t p-3 flex justify-end gap-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <SuitcaseList 
              suitcases={suitcases}
              onEdit={handleEditSuitcase}
              onDelete={handleDeleteSuitcase}
            />
          )}
          
          <CreateSuitcaseDialog 
            isOpen={showCreateDialog} 
            onClose={() => setShowCreateDialog(false)}
            onSubmit={handleCreateSuitcase}
          />
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Valises;
