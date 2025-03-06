
import React from 'react';
import { useForm } from 'react-hook-form';
import { 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CreateSuitcaseFormProps, CreateSuitcaseData } from '../types';

export const CreateSuitcaseForm: React.FC<CreateSuitcaseFormProps> = ({ 
  onSubmit,
  onSuccess,
  isLoading
}) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<CreateSuitcaseData>();

  const handleFormSubmit = (data: CreateSuitcaseData) => {
    onSubmit(data);
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Créer une valise</DialogTitle>
        <DialogDescription>
          Remplissez les informations pour créer une nouvelle valise.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom de la valise</Label>
          <Input 
            id="name"
            placeholder="Vacances d'été..."
            {...register('name', { required: 'Le nom est obligatoire' })}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (optionnelle)</Label>
          <Textarea 
            id="description"
            placeholder="Décrivez l'objectif de cette valise..."
            {...register('description')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start_date">Date de début</Label>
            <Input 
              id="start_date"
              type="date"
              {...register('start_date')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end_date">Date de fin</Label>
            <Input 
              id="end_date"
              type="date"
              {...register('end_date')}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onSuccess}
          >
            Annuler
          </Button>
          <Button 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Création...' : 'Créer'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};
