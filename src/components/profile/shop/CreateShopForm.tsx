
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getShopService } from '@/core/shop/infrastructure/ShopServiceProvider';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const CreateShopForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const shopService = getShopService();

  const createShopMutation = useMutation({
    mutationFn: async (shopData: { name: string; description: string; image_url?: string; status: string; user_id: string }) => {
      return await shopService.createShop(shopData);
    },
    onSuccess: () => {
      toast.success('Boutique créée avec succès');
      // Clear form
      setName('');
      setDescription('');
      setImageUrl('');
      // Refresh the shop data
      queryClient.invalidateQueries({ queryKey: ['shop'] });
    },
    onError: (error) => {
      toast.error(`Erreur lors de la création de la boutique: ${error.message}`);
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!name) {
      toast.error('Veuillez entrer un nom pour votre boutique');
      return;
    }
    
    if (!user) {
      toast.error('Vous devez être connecté pour créer une boutique');
      return;
    }

    createShopMutation.mutate({
      name,
      description,
      image_url: imageUrl,
      status: 'pending',
      user_id: user.id
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Créer votre boutique</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom de la boutique
          </label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom de votre boutique"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez votre boutique"
            rows={4}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image de la boutique
          </label>
          <ImageUpload
            onChange={setImageUrl}
            onUploading={setUploading}
            currentImageUrl={imageUrl}
          />
        </div>
        
        <Button type="submit" disabled={uploading || createShopMutation.isPending}>
          {createShopMutation.isPending ? 'Création en cours...' : 'Créer ma boutique'}
        </Button>
      </form>
    </div>
  );
};

export default CreateShopForm;
