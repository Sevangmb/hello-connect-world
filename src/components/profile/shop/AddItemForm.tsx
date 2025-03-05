
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getShopServiceInstance } from '@/core/shop/infrastructure/ShopServiceProvider';

const addItemSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
  price: z.coerce.number().positive('Price must be positive'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  image_url: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export type AddItemFormValues = z.infer<typeof addItemSchema>;

export interface AddItemFormProps {
  shopId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const AddItemForm: React.FC<AddItemFormProps> = ({ shopId, onSuccess, onCancel }) => {
  const form = useForm<AddItemFormValues>({
    resolver: zodResolver(addItemSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 1,
      image_url: '',
    },
  });

  const onSubmit = async (data: AddItemFormValues) => {
    try {
      const shopService = getShopServiceInstance();
      await shopService.createShopItem({
        ...data,
        shop_id: shopId,
        status: 'available',
      });
      onSuccess();
    } catch (error) {
      console.error('Error creating shop item:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input placeholder="Nom de l'article" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Description de l'article" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prix (€)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de l'image</FormLabel>
              <FormControl>
                <Input placeholder="https://exemple.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            Ajouter
          </Button>
        </div>
      </form>
    </Form>
  );
};
