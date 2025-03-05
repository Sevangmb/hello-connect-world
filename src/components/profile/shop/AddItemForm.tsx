
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useShop } from '@/hooks/useShop';
import { ShopItem } from '@/core/shop/domain/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

export const AddItemForm: React.FC = () => {
  const { useAddShopItem, useUserShop } = useShop();
  const addItemMutation = useAddShopItem();
  const { data: shop } = useUserShop();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      stock: '1',
      image_url: '',
      status: 'available'
    }
  });

  const onSubmit = async (data: any) => {
    if (!shop) {
      toast({
        title: "Error",
        description: "You need to create a shop first",
        variant: "destructive"
      });
      return;
    }

    try {
      const shopItem: Omit<ShopItem, "id" | "created_at" | "updated_at"> = {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        stock: parseInt(data.stock),
        image_url: data.image_url,
        shop_id: shop.id,
        status: data.status,
        clothes_id: data.clothes_id || null
      };

      await addItemMutation.mutateAsync(shopItem);
      toast({
        title: "Success",
        description: "Item added successfully"
      });
      reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Item</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register('name', { required: 'Name is required' })}
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
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              {...register('price', { 
                required: 'Price is required',
                min: { value: 0.01, message: 'Price must be greater than 0' } 
              })}
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              type="number"
              {...register('stock', { 
                required: 'Stock is required',
                min: { value: 0, message: 'Stock cannot be negative' } 
              })}
            />
            {errors.stock && (
              <p className="text-sm text-red-500">{errors.stock.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              {...register('image_url')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select defaultValue="available">
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="sold_out">Sold Out</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" disabled={addItemMutation.isPending}>
            {addItemMutation.isPending ? 'Adding...' : 'Add Item'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
