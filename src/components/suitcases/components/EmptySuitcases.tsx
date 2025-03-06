
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, ShoppingBag } from 'lucide-react';
import { EmptySuitcasesProps } from '../types';

export const EmptySuitcases: React.FC<EmptySuitcasesProps> = ({ onCreateClick }) => {
  return (
    <div className="w-full flex items-center justify-center py-16">
      <Card className="w-full max-w-md shadow-sm border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center p-8 space-y-6 text-center">
          <div className="bg-primary/10 p-4 rounded-full">
            <ShoppingBag className="h-12 w-12 text-primary" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-medium">Aucune valise</h3>
            <p className="text-muted-foreground text-sm">
              Vous n'avez pas encore créé de valise. Créez votre première valise pour commencer à organiser vos voyages.
            </p>
          </div>
          
          <Button 
            onClick={onCreateClick} 
            className="flex items-center"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Créer ma première valise
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
