
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { CreateSuitcaseData, CreateSuitcaseFormProps } from '../types';

export const CreateSuitcaseForm: React.FC<CreateSuitcaseFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading,
  isSubmitting,
  onSuccess
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateSuitcaseData>({
    defaultValues: initialData || {
      name: '',
      description: '',
      destination: '',
      startDate: '',
      endDate: ''
    }
  });

  const submitForm = (data: CreateSuitcaseData) => {
    onSubmit(data);
    if (onSuccess) onSuccess();
  };

  const isSubmittingForm = isLoading || isSubmitting;

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Nom de la valise
        </label>
        <Input
          id="name"
          {...register('name', { required: 'Le nom est obligatoire' })}
          placeholder="Vacances d'été"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Détails de votre valise"
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="destination" className="text-sm font-medium">
          Destination
        </label>
        <Input
          id="destination"
          {...register('destination')}
          placeholder="Paris, France"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="startDate" className="text-sm font-medium">
            Date de départ
          </label>
          <Input
            id="startDate"
            type="date"
            {...register('startDate')}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="endDate" className="text-sm font-medium">
            Date de retour
          </label>
          <Input
            id="endDate"
            type="date"
            {...register('endDate')}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        )}
        <Button type="submit" disabled={isSubmittingForm}>
          {isSubmittingForm ? 'Création...' : 'Créer la valise'}
        </Button>
      </div>
    </form>
  );
};
