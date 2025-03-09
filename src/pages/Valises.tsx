
import React from 'react';
import { useState, useEffect } from 'react';
import { SuitcaseList } from '@/components/suitcases/components/SuitcaseList';
import { CreateSuitcaseDialog } from '@/components/suitcases/components/CreateSuitcaseDialog';
import { Button } from '@/components/ui/button';
import { Plus, Luggage } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/modules/auth';
import { SuitcaseStatus } from '@/components/suitcases/types';
import { Skeleton } from '@/components/ui/skeleton';

const Valises = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [suitcases, setSuitcases] = useState([]);
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
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        console.log('Valises récupérées:', data?.length || 0);
        setSuitcases(data || []);
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

  const handleEditSuitcase = (id) => {
    // Rediriger vers la page de détail de la valise
    window.location.href = `/valises/${id}`;
  };

  const handleDeleteSuitcase = async (id) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette valise ?")) return;
    
    try {
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

  const handleCreateSuitcase = async (values) => {
    try {
      if (!user) throw new Error("Vous devez être connecté pour créer une valise");
      
      // Create the suitcase object with properly typed status
      const newSuitcase = {
        user_id: user.id,
        name: values.name,
        description: values.description || null,
        destination: values.destination || null,
        start_date: values.startDate || null,
        end_date: values.endDate || null,
        status: "active" as "active" // Type assertion to literal type
      };
      
      const { data, error } = await supabase
        .from('suitcases')
        .insert(newSuitcase)
        .select();
        
      if (error) throw error;
      
      console.log('Nouvelle valise créée:', data[0]);
      
      // Ajouter la nouvelle valise à la liste
      setSuitcases([data[0], ...suitcases]);
      
      toast({
        title: "Valise créée",
        description: "Votre nouvelle valise a été créée avec succès"
      });
      
      setShowCreateDialog(false);
    } catch (error) {
      console.error('Erreur lors de la création de la valise:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création de la valise"
      });
    }
  };

  return (
    <div className="container max-w-6xl mx-auto p-4">
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
            <div key={i} className="rounded-lg overflow-hidden border border-gray-200">
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
            </div>
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
  );
};

export default Valises;
