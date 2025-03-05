
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/ui/image-upload';
import { useShop } from '@/hooks/useShop';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface CreateShopFormProps {
  onSuccess?: () => void;
}

export function CreateShopForm({ onSuccess }: CreateShopFormProps) {
  const { createShop } = useShop();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      image_url: '',
    }
  });

  const imageUrl = watch('image_url');

  const onSubmit = async (data: { name: string; description: string; image_url: string }) => {
    if (!user) {
      toast({
        title: 'Erreur',
        description: 'Vous devez être connecté pour créer une boutique',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createShop.mutateAsync({
        user_id: user.id,
        name: data.name,
        description: data.description,
        image_url: data.image_url || undefined,
        status: 'pending',
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating shop:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de créer votre boutique. Veuillez réessayer.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Créer votre boutique</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Image de la boutique</label>
            <ImageUpload
              onChange={(url) => setValue('image_url', url)}
              onUploading={setIsUploading}
              value={imageUrl}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Nom de la boutique *
            </label>
            <Input
              id="name"
              {...register('name', { required: 'Le nom est requis' })}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              rows={4}
              {...register('description')}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Création en cours...
              </>
            ) : (
              'Créer ma boutique'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
