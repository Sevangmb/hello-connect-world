
import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useSuitcases } from '@/hooks/useSuitcases';
import { 
  CreateSuitcaseFormProps, 
  EmptySuitcasesProps, 
  SuitcaseItemsProps 
} from '@/components/suitcases/types';

// Component imports with proper type annotations
import { SuitcaseGrid } from '@/components/suitcases/components/SuitcaseGrid';
import { SuitcaseHeader } from '@/components/suitcases/components/SuitcaseHeader';
import { LoadingSuitcases } from '@/components/suitcases/components/LoadingSuitcases';
import { SuitcaseFilters } from '@/components/suitcases/components/SuitcaseFilters';

// Properly typed imports from components/suitcases
const EmptySuitcases = React.lazy(() => import('@/components/suitcases/components/EmptySuitcases')).then(
  module => ({ default: module.EmptySuitcases })
);

const SuitcaseItems = React.lazy(() => import('@/components/suitcases/components/SuitcaseItems')).then(
  module => ({ default: module.SuitcaseItems })
);

const CreateSuitcaseForm = React.lazy(() => import('@/components/suitcases/forms/CreateSuitcaseForm')).then(
  module => ({ default: module.CreateSuitcaseForm })
);

const Suitcases = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedSuitcaseId, setSelectedSuitcaseId] = useState<string | null>(null);
  const { data: suitcases, isLoading, createSuitcase } = useSuitcases();

  const handleCreateSuitcase = async (formData: any) => {
    await createSuitcase.mutateAsync(formData);
    setIsCreateDialogOpen(false);
  };

  const handleSelectSuitcase = (suitcaseId: string) => {
    setSelectedSuitcaseId(suitcaseId);
  };

  const handleBack = () => {
    setSelectedSuitcaseId(null);
  };

  if (isLoading) {
    return <LoadingSuitcases />;
  }

  if (selectedSuitcaseId) {
    return (
      <React.Suspense fallback={<LoadingSuitcases />}>
        <SuitcaseItems 
          suitcaseId={selectedSuitcaseId} 
          onBack={handleBack} 
        />
      </React.Suspense>
    );
  }

  if (suitcases && suitcases.length === 0) {
    return (
      <React.Suspense fallback={<LoadingSuitcases />}>
        <EmptySuitcases onCreateClick={() => setIsCreateDialogOpen(true)} />

        <Dialog 
          open={isCreateDialogOpen} 
          onOpenChange={setIsCreateDialogOpen}
        >
          <React.Suspense fallback={<div>Loading form...</div>}>
            <CreateSuitcaseForm 
              onSubmit={handleCreateSuitcase}
              onSuccess={() => setIsCreateDialogOpen(false)}
              isLoading={createSuitcase.isPending}
            />
          </React.Suspense>
        </Dialog>
      </React.Suspense>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SuitcaseHeader />
      
      <div className="flex justify-between items-center mb-8">
        <SuitcaseFilters />
        
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
          onSelect={handleSelectSuitcase} 
        />
      )}

      <Dialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
      >
        <React.Suspense fallback={<div>Loading form...</div>}>
          <CreateSuitcaseForm 
            onSubmit={handleCreateSuitcase}
            onSuccess={() => setIsCreateDialogOpen(false)}
            isLoading={createSuitcase.isPending}
          />
        </React.Suspense>
      </Dialog>
    </div>
  );
};

export default Suitcases;
