
import React from 'react';
import { useState, useEffect } from 'react';
import { SuitcaseList } from '@/components/suitcases/components/SuitcaseList';
import { CreateSuitcaseDialog } from '@/components/suitcases/components/CreateSuitcaseDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Suitcases = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [suitcases, setSuitcases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuitcases = async () => {
      const { data } = await supabase.from('suitcases').select('*');
      setSuitcases(data || []);
      setLoading(false);
    };

    fetchSuitcases();
  }, []);

  const handleEditSuitcase = (id) => {
    console.log('Edit suitcase', id);
  };

  const handleDeleteSuitcase = (id) => {
    console.log('Delete suitcase', id);
  };

  const handleCreateSuitcase = async (values) => {
    try {
      // Handle suitcase creation
      console.log('Create suitcase', values);
      setShowCreateDialog(false);
    } catch (error) {
      console.error('Error creating suitcase:', error);
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
      
      <SuitcaseList 
        suitcases={suitcases}
        onEdit={handleEditSuitcase}
        onDelete={handleDeleteSuitcase}
      />
      
      <CreateSuitcaseDialog 
        isOpen={showCreateDialog} 
        onClose={() => setShowCreateDialog(false)}
        onSubmit={handleCreateSuitcase}
      />
    </div>
  );
};

export default Suitcases;
