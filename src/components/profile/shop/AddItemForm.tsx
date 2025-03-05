
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';
import { useToast } from '@/hooks/use-toast';
import { useShop } from '@/hooks/useShop';

const formSchema = z.object({
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  description: z.string().optional(),
  price: z.coerce.number().positive('Le prix doit être positif'),
  original_price: z.coerce.number().positive().optional(),
  stock: z.coerce.number().int().nonnegative('Le stock doit être positif ou zéro'),
  image_url: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddItemFormProps {
  shopId: string;
}

export function AddItemForm({ shopId }: AddItemFormProps) {
  const { addShopItem } = useShop(null);
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 1,
      image_url: '',
    },
  });
  
  const onSubmit = async (values: FormValues) => {
    try {
      const newItem = {
        shop_id: shopId,
        name: values.name,
        description: values.description || '',
        price: values.price,
        original_price: values.original_price,
        stock: values.stock,
        status: 'available' as const,
        image_url: values.image_url,
      };
      
      await addShopItem.mutateAsync(newItem);
      
      toast({
        title: 'Article ajouté',
        description: 'L\'article a été ajouté à votre boutique avec succès.',
      });
      
      form.reset();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'article:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible d\'ajouter l\'article. Veuillez réessayer.',
      });
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-xl font-semibold">Ajouter un article</h2>
        
        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image de l'article</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  onUploading={setIsUploading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom de l'article</FormLabel>
                <FormControl>
                  <Input placeholder="T-shirt en coton" {...field} />
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
                <FormLabel>Prix</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" placeholder="29.99" {...field} />
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
                  <Input type="number" min="0" step="0.01" placeholder="39.99" {...field} />
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
                <FormLabel>Stock disponible</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="1" placeholder="10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Décrivez votre article..."
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isUploading || addShopItem.isPending}>
          {addShopItem.isPending ? 'En cours...' : 'Ajouter l\'article'}
        </Button>
      </form>
    </Form>
  );
}
