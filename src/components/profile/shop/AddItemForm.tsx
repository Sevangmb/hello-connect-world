
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { getShopService } from '@/core/shop/infrastructure/ShopServiceProvider';
import { ShopItem } from '@/core/shop/domain/types';

interface AddItemFormProps {
  shopId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const AddItemForm = ({ shopId, onSuccess, onCancel }: AddItemFormProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [stock, setStock] = useState<number | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !price || stock === undefined) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const shopService = getShopService();
      
      // S'assurer que toutes les propriétés requises sont présentes
      const itemData: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'> = {
        shop_id: shopId,
        name,
        description,
        price,
        stock,
        image_url: imageUrl,
        status: 'available',
        clothes_id: undefined, // Ou utiliser un ID valide si nécessaire
        shop: { name: '' } // Requis par l'interface mais sera ignoré à l'insertion
      };
      
      await shopService.createShopItem(itemData);
      onSuccess();
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Une erreur est survenue lors de l\'ajout de l\'article');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Ajouter un nouvel article</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom *</Label>
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
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Prix *</Label>
            <Input 
              id="price" 
              type="number" 
              value={price || ''} 
              onChange={(e) => setPrice(parseFloat(e.target.value))} 
              placeholder="Prix"
              required
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="stock">Stock *</Label>
            <Input 
              id="stock" 
              type="number" 
              value={stock || ''} 
              onChange={(e) => setStock(parseInt(e.target.value))} 
              placeholder="Quantité en stock"
              required
              min="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL de l'image</Label>
            <Input 
              id="imageUrl" 
              value={imageUrl} 
              onChange={(e) => setImageUrl(e.target.value)} 
              placeholder="URL de l'image"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Ajout en cours...' : 'Ajouter'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AddItemForm;
