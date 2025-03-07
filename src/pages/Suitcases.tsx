
import React from 'react';
import { SuitcaseList } from '@/components/suitcases/components/SuitcaseList';
import { CreateSuitcaseDialog } from '@/components/suitcases/components/CreateSuitcaseDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const Suitcases = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <div className="container max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mes valises</h1>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Créer une valise
        </Button>
      </div>
      
      <SuitcaseList />
      
      <CreateSuitcaseDialog 
        isOpen={showCreateDialog} 
        onClose={() => setShowCreateDialog(false)} 
      />
    </div>
  );
};

export default Suitcases;
