
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useShop } from '@/hooks/useShop';
import { Shop } from '@/core/shop/domain/types';

export const ShopSettings: React.FC = () => {
  const { useUserShop, useUpdateShop } = useShop();
  const { data: shop, isLoading } = useUserShop();
  const updateShopMutation = useUpdateShop();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: shop?.name || '',
      description: shop?.description || '',
      address: shop?.address || '',
      phone: shop?.phone || '',
      website: shop?.website || '',
      image_url: shop?.image_url || ''
    }
  });

  const onSubmit = async (data: any) => {
    if (shop) {
      updateShopMutation.mutate({
        shopId: shop.id,
        data
      });
    }
  };

  if (isLoading) {
    return <div>Loading shop settings...</div>;
  }

  if (!shop) {
    return <div>You don't have a shop to configure.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shop Settings</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Shop Name</Label>
            <Input
              id="name"
              {...register('name', { required: 'Shop name is required' })}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              {...register('address')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              {...register('phone')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              {...register('website')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              {...register('image_url')}
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" disabled={updateShopMutation.isPending}>
            {updateShopMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ShopSettings;
