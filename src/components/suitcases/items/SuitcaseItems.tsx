
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { SuitcaseItemsProps } from '../types';
import { useSuitcase } from '@/hooks/useSuitcases';
import { LoadingSuitcases } from '../components/LoadingSuitcases';
import { Dialog } from '@/components/ui/dialog';

export const SuitcaseItems: React.FC<SuitcaseItemsProps> = ({ 
  suitcaseId, 
  onBack 
}) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { data: suitcase, isLoading } = useSuitcase(suitcaseId);

  if (isLoading || !suitcase) {
    return <LoadingSuitcases />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onBack} size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold">{suitcase.name}</h1>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Articles</h2>
          <p className="text-muted-foreground">Gérez les vêtements à emporter dans votre valise</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un vêtement
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="text-center py-10">
            <p className="text-muted-foreground">Aucun vêtement dans cette valise pour le moment.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setShowAddDialog(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un vêtement
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Ajouter un vêtement à la valise</h2>
          <p className="text-muted-foreground mb-4">
            Sélectionnez les vêtements à ajouter à votre valise
          </p>
          <div className="text-center py-10">
            <p>Formulaire d'ajout de vêtements à implémenter</p>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
