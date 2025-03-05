
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useShop } from '@/hooks/useShop';
import { Shop } from '@/core/shop/domain/types';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const CreateShopForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { useCreateShop } = useShop();
  const createShopMutation = useCreateShop();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      description: '',
      address: '',
      phone: '',
      website: '',
      image_url: ''
    }
  });

  const onSubmit = async (data: any) => {
    if (!user?.id) return;
    
    const shopData: Omit<Shop, 'id' | 'created_at' | 'updated_at'> = {
      user_id: user.id,
      name: data.name,
      description: data.description,
      address: data.address,
      phone: data.phone,
      website: data.website,
      image_url: data.image_url,
      status: 'pending',
      average_rating: 0,
    };
    
    try {
      await createShopMutation.mutateAsync(shopData);
      navigate('/profile/shop');
    } catch (error) {
      console.error('Error creating shop:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Your Shop</CardTitle>
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
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
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
          <Button type="submit" disabled={createShopMutation.isPending}>
            {createShopMutation.isPending ? 'Creating...' : 'Create Shop'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CreateShopForm;
