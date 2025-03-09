
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
        const { data, error } = await supabase
          .from('suitcases')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
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
      
      // Use 'active' as string instead of SuitcaseStatus to match the database expectations
      const newSuitcase = {
        user_id: user.id,
        name: values.name,
        description: values.description || null,
        destination: values.destination || null,
        start_date: values.startDate || null,
        end_date: values.endDate || null,
        status: 'active' // Using string literal instead of SuitcaseStatus
      };
      
      const { data, error } = await supabase
        .from('suitcases')
        .insert(newSuitcase)
        .select();
        
      if (error) throw error;
      
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
        <div className="flex flex-col items-center justify-center py-10">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-gray-200 h-12 w-12 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-24 mb-2.5"></div>
            <div className="h-3 bg-gray-200 rounded w-32"></div>
          </div>
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
