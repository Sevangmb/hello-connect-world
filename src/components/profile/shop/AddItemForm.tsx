
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ShopItemStatus } from '@/core/shop/domain/types';
import { useShop } from '@/hooks/useShop';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Define form schema for validation
const addItemSchema = z.object({
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  description: z.string().optional(),
  price: z.coerce.number().positive('Le prix doit être positif'),
  original_price: z.coerce.number().optional(),
  stock: z.coerce.number().int().nonnegative('Le stock ne peut pas être négatif'),
  image_url: z.string().optional(),
  clothes_id: z.string().optional(),
});

type FormValues = z.infer<typeof addItemSchema>;

interface AddItemFormProps {
  shopId: string;
  onSuccess: () => void;
}

export function AddItemForm({ shopId, onSuccess }: AddItemFormProps) {
  const { useAddShopItem } = useShop();
  const { mutate: addItem, isPending } = useAddShopItem();

  const form = useForm<FormValues>({
    resolver: zodResolver(addItemSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      original_price: undefined,
      stock: 1,
      image_url: '',
      clothes_id: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    // Ensure we have a shop_id attached to the item
    addItem(
      {
        shopId: shopId,
        item: {
          ...values,
          shop_id: shopId,
          status: 'available' as ShopItemStatus,
        },
      },
      {
        onSuccess: () => {
          form.reset();
          onSuccess();
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de l'article</FormLabel>
              <FormControl>
                <Input placeholder="Nom de l'article" {...field} id="name" />
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
                <Textarea placeholder="Description de l'article" {...field} id="description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Prix" {...field} min={0} step={0.01} id="price" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="original_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix original (optionnel)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Prix original" 
                    {...field} 
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    min={0} 
                    step={0.01} 
                    id="original_price" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantité disponible</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Quantité" {...field} min={0} id="stock" />
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
              <FormLabel>URL de l'image (optionnel)</FormLabel>
              <FormControl>
                <Input placeholder="URL de l'image" {...field} id="image_url" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? <LoadingSpinner size="sm" className="mr-2" /> : null}
            Ajouter l'article
          </Button>
        </div>
      </form>
    </Form>
  );
}
