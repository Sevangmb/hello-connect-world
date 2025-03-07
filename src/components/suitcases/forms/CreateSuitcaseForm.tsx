
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
  isSubmitting,
  onSuccess
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateSuitcaseData>({
    defaultValues: initialData || {
      name: '',
      description: '',
      start_date: '',
      end_date: ''
    }
  });

  const submitForm = (data: CreateSuitcaseData) => {
    onSubmit(data);
    if (onSuccess) onSuccess();
  };

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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="start_date" className="text-sm font-medium">
            Date de départ
          </label>
          <Input
            id="start_date"
            type="date"
            {...register('start_date')}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="end_date" className="text-sm font-medium">
            Date de retour
          </label>
          <Input
            id="end_date"
            type="date"
            {...register('end_date')}
          />
        </div>
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

      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Création...' : 'Créer la valise'}
        </Button>
      </div>
    </form>
  );
};
