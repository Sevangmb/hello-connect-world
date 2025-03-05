
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';
import { useToast } from '@/hooks/use-toast';
import { getShopService } from '@/core/shop/infrastructure/ShopServiceProvider';
import { ShopStatus } from '@/core/shop/domain/types';

export const CreateShopForm = () => {
  const { user } = useAuth();
  const [shopName, setShopName] = useState('');
  const [shopDescription, setShopDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const { toast } = useToast();
  const shopService = getShopService();

  const createShopMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error('You must be logged in to create a shop');
      }
      
      return await shopService.createShop({
        name: shopName,
        description: shopDescription,
        image_url: imageUrl || undefined,
        status: 'pending' as ShopStatus,
        user_id: user.id
      });
    },
    onSuccess: () => {
      toast({
        title: 'Boutique créée avec succès',
        description: 'Votre boutique est en cours de validation par nos équipes.',
      });
      
      // Reset form
      setShopName('');
      setShopDescription('');
      setImageUrl('');
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: `Une erreur est survenue: ${error.message}`,
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shopName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Le nom de la boutique est obligatoire.',
      });
      return;
    }
    
    createShopMutation.mutate();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">Créer votre boutique</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nom de votre boutique *</Label>
          <Input
            id="name"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            placeholder="Nom de votre boutique"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={shopDescription}
            onChange={(e) => setShopDescription(e.target.value)}
            placeholder="Décrivez votre boutique et les articles que vous vendez"
            rows={4}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Image de votre boutique</Label>
          <ImageUpload
            onChange={setImageUrl}
            onUploading={setImageUploading}
            currentImageUrl={imageUrl}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={createShopMutation.isPending || !shopName.trim() || imageUploading}
        >
          {createShopMutation.isPending ? 'Création en cours...' : 'Créer ma boutique'}
        </Button>
      </form>
    </div>
  );
};

export default CreateShopForm;
