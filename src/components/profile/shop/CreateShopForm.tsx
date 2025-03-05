
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import ImageUpload from '@/components/ui/image-upload';
import { useShop } from '@/hooks/useShop';
import { useNavigate } from 'react-router-dom';

const CreateShopForm = () => {
  const { toast } = useToast();
  const { createShop } = useShop();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom de la boutique est requis",
        variant: "destructive",
      });
      return;
    }

    if (isUploading) {
      toast({
        title: "Attention",
        description: "Veuillez attendre la fin du téléchargement de l'image",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const shopData = {
        name,
        description,
        image_url: imageUrl,
        user_id: 'current-user', // This will be replaced by the actual user ID in the backend
      };
      
      const shop = await createShop(shopData);
      
      toast({
        title: "Succès",
        description: "Votre boutique a été créée avec succès",
      });
      
      // Redirect to shop dashboard
      navigate(`/profile/shop`);
    } catch (error) {
      console.error("Error creating shop:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la boutique",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Créer votre boutique</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Nom de votre boutique
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nom de votre boutique"
              required
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
              onChange={(url) => setImageUrl(url)}
              onUploading={setIsUploading}
              bucket="shops"
              folder="logos"
              currentImageUrl={imageUrl}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting ? 'Création en cours...' : 'Créer ma boutique'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateShopForm;
