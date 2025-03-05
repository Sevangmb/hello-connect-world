import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ShopItem } from '@/core/shop/domain/types';
import { getShopServiceInstance } from '@/core/shop/infrastructure/ShopServiceProvider';

interface AddItemFormProps {
  shopId: string;
  onSuccess?: () => void;
}

export default function AddItemForm({ shopId, onSuccess }: AddItemFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stock, setStock] = useState('1');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setUploading] = useState(false);
  const { toast } = useToast();

  const addShopItem = async (shopId: string, itemData: any) => {
    return { id: '123' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price || !stock) {
      toast({
        title: 'Missing fields',
        description: 'Please fill out all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      const itemData = {
        shop_id: shopId,
        name,
        description,
        price: parseFloat(price),
        original_price: originalPrice ? parseFloat(originalPrice) : undefined,
        stock: parseInt(stock, 10),
        image_url: imageUrl,
        status: 'available',
      };

      const result = await addShopItem(shopId, itemData);

      if (result) {
        toast({
          title: 'Item added',
          description: 'Your item has been added to the shop',
        });

        setName('');
        setDescription('');
        setPrice('');
        setOriginalPrice('');
        setStock('1');
        setImageUrl('');

        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item to shop',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ajouter un article</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <ImageUpload
              onChange={setImageUrl}
              onUploading={setUploading}
              currentImageUrl={imageUrl}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nom de l'article *</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Prix (€) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="originalPrice">Prix d'origine (€)</Label>
              <Input
                id="originalPrice"
                type="number"
                min="0"
                step="0.01"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock">Quantité en stock *</Label>
            <Input
              id="stock"
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <Button type="submit" disabled={isUploading}>
            Ajouter un article
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        {/* CardFooter content */}
      </CardFooter>
    </Card>
  );
}

export { default as AddItemForm } from './AddItemForm';
