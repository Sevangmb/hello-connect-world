
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';
import { useToast } from '@/hooks/use-toast';
import { useShop } from '@/hooks/useShop';
import { useAuth } from '@/hooks/useAuth';
import { ShopStatus } from '@/core/shop/domain/types';

interface CreateShopFormProps {
  onSuccess?: () => void;
}

const CreateShopForm: React.FC<CreateShopFormProps> = ({ onSuccess }) => {
  const { createShop } = useShop();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      description: '',
    }
  });

  const onSubmit = async (data: { name: string; description: string }) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour créer une boutique",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await createShop({
        name: data.name,
        description: data.description,
        image_url: imageUrl || undefined,
        status: 'pending' as ShopStatus,
        user_id: user.id
      });
      
      toast({
        title: "Boutique créée",
        description: "Votre boutique a été créée avec succès.",
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating shop:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la création de votre boutique.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="image">Image de la boutique</Label>
        <div className="mt-2">
          <ImageUpload 
            onChange={setImageUrl}
            onUploading={setIsUploading}
            currentImageUrl={imageUrl}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="name">Nom de la boutique</Label>
        <Input
          id="name"
          {...register('name', { required: "Le nom est requis" })}
          className="mt-1"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message?.toString()}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          className="mt-1"
          rows={4}
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={isSubmitting || isUploading}
        className="w-full"
      >
        {isSubmitting ? "Création en cours..." : "Créer ma boutique"}
      </Button>
    </form>
  );
};

export default CreateShopForm;
