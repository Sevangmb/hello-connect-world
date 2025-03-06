
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon, GridIcon, ListIcon } from 'lucide-react';
import { useSuitcases } from '@/hooks/useSuitcases';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CreateSuitcaseForm } from '@/components/suitcases/forms/CreateSuitcaseForm';
import { EmptySuitcases } from '@/components/suitcases/components/EmptySuitcases';
import { LoadingSuitcases } from '@/components/suitcases/components/LoadingSuitcases';
import { SuitcaseItems } from '@/components/suitcases/items/SuitcaseItems';
import { SuitcaseGrid } from '@/components/suitcases/components/SuitcaseGrid';

const Suitcases = () => {
  const { data, isLoading, isError } = useSuitcases();
  const [selectedSuitcaseId, setSelectedSuitcaseId] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);

  if (isLoading) {
    return <LoadingSuitcases />;
  }

  if (isError) {
    return <div>Error loading suitcases</div>;
  }

  const suitcases = data || [];

  if (suitcases.length === 0 && !showCreateModal) {
    return (
      <EmptySuitcases onCreateClick={() => setShowCreateModal(true)} />
    );
  }

  if (selectedSuitcaseId) {
    return (
      <SuitcaseItems
        suitcaseId={selectedSuitcaseId}
        onBack={() => setSelectedSuitcaseId('')}
      />
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Mes valises</h1>
        <div className="flex items-center gap-4">
          <div className="bg-muted rounded-md flex overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-none"
            >
              <GridIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-none"
            >
              <ListIcon className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <PlusIcon className="mr-2 h-4 w-4" /> Nouvelle valise
          </Button>
        </div>
      </div>

      <SuitcaseGrid
        suitcases={suitcases}
        viewMode={viewMode}
        selectedSuitcaseId={selectedSuitcaseId}
        setSelectedSuitcaseId={setSelectedSuitcaseId}
      />

      <Dialog
        open={showCreateModal}
        onOpenChange={(open) => setShowCreateModal(open)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer une nouvelle valise</DialogTitle>
          </DialogHeader>
          <CreateSuitcaseForm 
            onSuccess={() => setShowCreateModal(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Suitcases;
