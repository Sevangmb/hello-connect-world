
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useSuitcases } from '@/hooks/useSuitcases';
import { Plus, Loader2, Grid, List } from 'lucide-react';
import { CreateSuitcaseDialog } from '@/components/suitcases/CreateSuitcaseDialog';
import SuitcaseGrid from '@/components/suitcases/components/SuitcaseGrid';  // Fix this import

const Suitcases = () => {
  const { 
    suitcases, 
    isLoading, 
    isError 
  } = useSuitcases();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedSuitcaseId, setSelectedSuitcaseId] = useState<string>('');

  // Redirect to the detail page if a suitcase is selected
  useEffect(() => {
    if (selectedSuitcaseId) {
      // Simulate navigation - in a real app, use router.push or similar
      console.log(`Navigate to suitcase detail: ${selectedSuitcaseId}`);
    }
  }, [selectedSuitcaseId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Chargement de vos valises...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <p className="text-destructive">Une erreur est survenue lors du chargement de vos valises.</p>
        <Button variant="outline" className="mt-4">Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Vos valises</h1>
        <div className="flex gap-2">
          <div className="bg-background border rounded-md p-1 flex">
            <Button 
              variant={viewMode === 'grid' ? "default" : "ghost"} 
              size="icon" 
              onClick={() => setViewMode('grid')}
              className="h-8 w-8"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? "default" : "ghost"} 
              size="icon" 
              onClick={() => setViewMode('list')}
              className="h-8 w-8"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Créer une valise
          </Button>
        </div>
      </div>

      <SuitcaseGrid
        suitcases={suitcases}
        viewMode={viewMode}
        selectedSuitcaseId={selectedSuitcaseId}
        setSelectedSuitcaseId={setSelectedSuitcaseId}
      />

      <CreateSuitcaseDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
};

export default Suitcases;
