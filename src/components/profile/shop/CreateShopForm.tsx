
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getShopServiceInstance } from '@/core/shop/infrastructure/ShopServiceProvider';
import { useToast } from '@/hooks/use-toast';

const CreateShopForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const shopService = getShopServiceInstance();

  const createShopMutation = useMutation({
    mutationFn: async (shopData: { name: string; description: string; image_url?: string }) => {
      return await shopService.createShop(shopData);
    },
    onSuccess: () => {
      toast({
        title: "Boutique créée",
        description: "Votre boutique a été créée avec succès.",
      });
      setName('');
      setDescription('');
      setImageUrl('');
      queryClient.invalidateQueries({ queryKey: ['shop'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer la boutique. Veuillez réessayer.",
      });
      console.error("Error creating shop:", error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le nom de la boutique est requis.",
      });
      return;
    }
    
    createShopMutation.mutate({
      name,
      description,
      image_url: imageUrl
    });
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Créer votre boutique</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Nom de la boutique
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Nom de votre boutique"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez votre boutique"
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Image de la boutique
            </label>
            <ImageUpload
              onChange={setImageUrl}
              onUploading={setIsUploading}
              currentImageUrl={imageUrl}
            />
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={!name.trim() || isUploading || createShopMutation.isPending}
          >
            {createShopMutation.isPending ? "Création en cours..." : "Créer la boutique"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateShopForm;
