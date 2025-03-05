
import React from 'react';
import { useShop } from '@/hooks/useShop';
import { ImageUpload } from '@/components/ui/image-upload';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface AddItemFormProps {
  shopId: string;
  onSuccess?: () => void;
}

export default function AddItemForm({ shopId, onSuccess }: AddItemFormProps) {
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [originalPrice, setOriginalPrice] = React.useState('');
  const [stock, setStock] = React.useState('1');
  const [imageUrl, setImageUrl] = React.useState('');
  const [isUploading, setIsUploading] = React.useState(false);
  const { toast } = useToast();

  // Mock implementation for the shop hooks
  const addShopItem = async (shopId: string, itemData: any) => {
    // Mock implementation
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

        // Reset form
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
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Add New Item</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="image" className="block text-sm font-medium">
            Product Image
          </label>
          <ImageUpload
            onChange={setImageUrl}
            onUploading={setIsUploading}
            defaultValue={imageUrl}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">
            Product Name *
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="price" className="block text-sm font-medium">
              Price (€) *
            </label>
            <input
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
            <label htmlFor="originalPrice" className="block text-sm font-medium">
              Original Price (€)
            </label>
            <input
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
          <label htmlFor="stock" className="block text-sm font-medium">
            Stock Quantity *
          </label>
          <input
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
          Add Product
        </Button>
      </form>
    </div>
  );
}

// Fix for correct imports in parent files
export { default as AddItemForm } from './AddItemForm';
