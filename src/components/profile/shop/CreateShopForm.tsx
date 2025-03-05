
import React from 'react';
import { useShop } from '@/hooks/useShop';
import { ShopStatus } from '@/core/shop/domain/types';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/ui/image-upload';
import { Button } from '@/components/ui/button';

interface CreateShopFormProps {
  onSuccess?: (shopId: string) => void;
}

export default function CreateShopForm({ onSuccess }: CreateShopFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const [isUploading, setIsUploading] = React.useState(false);

  // Mock implementation for the shop hooks
  const createShop = async (shopData: any) => {
    // Mock implementation
    return { id: '123' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to create a shop',
        variant: 'destructive',
      });
      return;
    }

    if (!name || !description) {
      toast({
        title: 'Missing fields',
        description: 'Please provide a name and description for your shop',
        variant: 'destructive',
      });
      return;
    }

    try {
      const shopData = {
        user_id: user.id,
        name,
        description,
        image_url: imageUrl,
        status: 'pending' as ShopStatus
      };

      // Use the mutation object directly
      const result = await createShop(shopData);
      
      if (result) {
        toast({
          title: 'Shop created',
          description: 'Your shop has been created and is pending approval',
        });

        if (onSuccess) {
          onSuccess(result.id);
        }
      }
    } catch (error) {
      console.error('Error creating shop:', error);
      toast({
        title: 'Error',
        description: 'Failed to create shop. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Create Your Shop</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Shop Image</label>
          <ImageUpload
            onChange={setImageUrl}
            onUploading={setIsUploading}
            defaultValue={imageUrl}
          />
          <p className="text-xs text-gray-500 mt-1">
            Add a logo or banner for your shop
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">
            Shop Name *
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
            Description *
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            rows={4}
            required
          ></textarea>
          <p className="text-xs text-gray-500">
            Tell customers about your shop, what you sell, and your brand
          </p>
        </div>

        <Button type="submit" disabled={isUploading}>
          Create Shop
        </Button>
      </form>
    </div>
  );
}

// Fix for correct imports in parent files
export { default as CreateShopForm } from './CreateShopForm';
