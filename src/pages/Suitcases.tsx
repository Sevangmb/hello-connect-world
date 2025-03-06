
import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useSuitcases } from '@/hooks/useSuitcases';
import { CreateSuitcaseFormProps } from '@/components/suitcases/types';

// Importations correctes des composants
import { SuitcaseGrid } from '@/components/suitcases/components/SuitcaseGrid';
import { SuitcaseHeader } from '@/components/suitcases/components/SuitcaseHeader';
import { LoadingSuitcases } from '@/components/suitcases/components/LoadingSuitcases';
import { SuitcaseFilters } from '@/components/suitcases/components/SuitcaseFilters';
import { EmptySuitcases } from '@/components/suitcases/components/EmptySuitcases';
import { SuitcaseItems } from '@/components/suitcases/items/SuitcaseItems';
import { CreateSuitcaseForm } from '@/components/suitcases/forms/CreateSuitcaseForm';

const Suitcases = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedSuitcaseId, setSelectedSuitcaseId] = useState<string | null>(null);
  const { 
    data: suitcases, 
    isLoading, 
    mutateAsync: createSuitcaseMutation
  } = useSuitcases();

  const handleCreateSuitcase = async (formData: any) => {
    await createSuitcaseMutation(formData);
    setIsCreateDialogOpen(false);
  };

  const handleSelectSuitcase = (suitcaseId: string) => {
    setSelectedSuitcaseId(suitcaseId);
  };

  const handleBack = () => {
    setSelectedSuitcaseId(null);
  };

  const handleRefresh = () => {
    // Rafraîchir les données
    console.log('Refreshing suitcases data');
  };

  // Filtres et statuts fictifs pour les props de SuitcaseFilters
  const filters = {
    status: 'all',
    search: '',
    date: null
  };

  const statusLabels = {
    all: 'Toutes',
    active: 'Actives',
    archived: 'Archivées',
    completed: 'Terminées'
  };

  const handleStatusChange = (status: string) => {
    console.log('Status changed to:', status);
  };

  const handleClearSearch = () => {
    console.log('Search cleared');
  };

  if (isLoading) {
    return <LoadingSuitcases />;
  }

  if (selectedSuitcaseId) {
    return (
      <SuitcaseItems 
        suitcaseId={selectedSuitcaseId} 
        onBack={handleBack} 
      />
    );
  }

  if (suitcases && suitcases.length === 0) {
    return (
      <>
        <EmptySuitcases onCreateClick={() => setIsCreateDialogOpen(true)} />

        <Dialog 
          open={isCreateDialogOpen} 
          onOpenChange={setIsCreateDialogOpen}
        >
          <CreateSuitcaseForm 
            onSubmit={handleCreateSuitcase}
            onSuccess={() => setIsCreateDialogOpen(false)}
            isLoading={false}
          />
        </Dialog>
      </>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SuitcaseHeader onRefresh={handleRefresh} />
      
      <div className="flex justify-between items-center mb-8">
        <SuitcaseFilters 
          filters={filters}
          statusLabels={statusLabels}
          onStatusChange={handleStatusChange}
          onClearSearch={handleClearSearch}
        />
        
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="flex items-center"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Créer une valise
        </Button>
      </div>

      {suitcases && (
        <SuitcaseGrid 
          suitcases={suitcases}
          onSelectSuitcase={handleSelectSuitcase}
        />
      )}

      <Dialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
      >
        <CreateSuitcaseForm 
          onSubmit={handleCreateSuitcase}
          onSuccess={() => setIsCreateDialogOpen(false)}
          isLoading={false}
        />
      </Dialog>
    </div>
  );
};

export default Suitcases;
