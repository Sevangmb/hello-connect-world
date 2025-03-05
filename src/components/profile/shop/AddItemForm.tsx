
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import ImageUpload from '@/components/ui/image-upload';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useShop } from '@/hooks/useShop';

interface AddItemFormProps {
  shopId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ shopId, onSuccess, onCancel }) => {
  const { addShopItem } = useShop();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('1');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !price || isNaN(Number(price)) || Number(price) <= 0) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs requis correctement',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addShopItem({
        shop_id: shopId,
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        image_url: imageUrl,
        status: 'available'
      });
      
      toast({
        title: 'Succès',
        description: 'Article ajouté à votre boutique',
      });
      
      // Reset form
      setName('');
      setDescription('');
      setPrice('');
      setStock('1');
      setImageUrl('');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error adding shop item:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter l\'article. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ajouter un nouvel article</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom de l'article *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nom de l'article"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description de l'article"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Prix (€) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stock">Quantité disponible *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                step="1"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Image de l'article</Label>
            <ImageUpload
              value={imageUrl}
              onChange={(url) => setImageUrl(url)}
              onUploading={setIsUploading}
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between gap-2">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Annuler
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={isSubmitting || isUploading}
            className="ml-auto"
          >
            {isSubmitting ? 'Ajout en cours...' : 'Ajouter l\'article'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AddItemForm;
