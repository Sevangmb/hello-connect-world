
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export interface CreateSuitcaseFormProps {
  onSuccess: () => void;
}

export function CreateSuitcaseForm({ onSuccess }: CreateSuitcaseFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    onSuccess();
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Créer une valise</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom de la valise</Label>
            <Input id="name" placeholder="Ex: Vacances d'été" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (optionnel)</Label>
            <Input id="description" placeholder="Détails sur votre valise" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="destination">Destination (optionnel)</Label>
            <Input id="destination" placeholder="Ex: Paris" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onSuccess}>Annuler</Button>
          <Button type="submit">Créer</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
