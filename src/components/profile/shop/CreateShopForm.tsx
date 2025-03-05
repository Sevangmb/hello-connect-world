
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useShop } from '@/hooks/useShop';
import { Shop } from '@/core/shop/domain/types';

const shopFormSchema = z.object({
  name: z.string().min(3, { message: 'Le nom de la boutique doit contenir au moins 3 caractères' }),
  description: z.string().min(10, { message: 'La description doit contenir au moins 10 caractères' }),
  image_url: z.string().optional(),
});

type ShopFormValues = z.infer<typeof shopFormSchema>;

interface CreateShopFormProps {
  onSuccess?: (shop: Shop) => void;
}

export function CreateShopForm({ onSuccess }: CreateShopFormProps) {
  const { createShop } = useShop();
  
  const form = useForm<ShopFormValues>({
    resolver: zodResolver(shopFormSchema),
    defaultValues: {
      name: '',
      description: '',
      image_url: '',
    },
  });
  
  const onSubmit = async (values: ShopFormValues) => {
    const shop = await createShop({
      name: values.name,
      description: values.description,
      image_url: values.image_url || undefined,
      user_id: '',  // Sera remplacé dans useShop
    });
    
    if (shop && onSuccess) {
      onSuccess(shop);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de la boutique</FormLabel>
              <FormControl>
                <Input placeholder="Ma boutique super" {...field} />
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
                <Textarea 
                  placeholder="Décrivez votre boutique, ce que vous vendez, etc."
                  {...field}
                  rows={4}
                />
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
              <FormLabel>Image URL (optionnel)</FormLabel>
              <FormControl>
                <Input placeholder="https://exemple.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Création en cours...' : 'Créer ma boutique'}
        </Button>
      </form>
    </Form>
  );
}
