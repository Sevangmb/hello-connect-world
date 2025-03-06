
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { EmptySuitcases } from '@/components/suitcases/components/EmptySuitcases';
import { LoadingSuitcases } from '@/components/suitcases/components/LoadingSuitcases';
import { SuitcaseItems } from '@/components/suitcases/items/SuitcaseItems';
import { SuitcaseGrid } from '@/components/suitcases/components/SuitcaseGrid';
import { CreateSuitcaseForm } from '@/components/suitcases/forms/CreateSuitcaseForm';

const Suitcases = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [suitcases, setSuitcases] = useState([]);
  const [selectedSuitcaseId, setSelectedSuitcaseId] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock data loading
  React.useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleCreateSuitcase = () => {
    setShowCreateDialog(true);
  };

  const handleCreateSuccess = () => {
    setShowCreateDialog(false);
    // Refresh suitcases list
  };

  const handleBackFromItems = () => {
    setSelectedSuitcaseId('');
  };

  if (isLoading) {
    return <LoadingSuitcases />;
  }

  if (suitcases.length === 0) {
    return (
      <EmptySuitcases onCreateClick={handleCreateSuitcase} />
    );
  }

  if (selectedSuitcaseId) {
    return (
      <SuitcaseItems 
        suitcaseId={selectedSuitcaseId} 
        onBack={handleBackFromItems} 
      />
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mes Valises</h1>
        <div className="flex space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            onClick={() => setViewMode('grid')}
            size="sm"
          >
            Grille
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => setViewMode('list')}
            size="sm"
          >
            Liste
          </Button>
          <Button onClick={handleCreateSuitcase}>
            Nouvelle valise
          </Button>
        </div>
      </div>

      <SuitcaseGrid
        suitcases={suitcases}
        viewMode={viewMode}
        selectedSuitcaseId={selectedSuitcaseId}
        setSelectedSuitcaseId={setSelectedSuitcaseId}
      />

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <CreateSuitcaseForm onSuccess={handleCreateSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Suitcases;
