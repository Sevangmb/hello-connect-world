
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, X } from 'lucide-react';
import { useShop } from '@/hooks/useShop';
import { ShopItem } from '@/core/shop/domain/types';

const itemFormSchema = z.object({
  name: z.string().min(3, { message: 'Le nom doit contenir au moins 3 caractères' }),
  description: z.string().min(10, { message: 'La description doit contenir au moins 10 caractères' }),
  price: z.preprocess(
    (val) => Number(val),
    z.number().positive({ message: 'Le prix doit être positif' })
  ),
  original_price: z.preprocess(
    (val) => val === '' ? undefined : Number(val),
    z.number().positive({ message: 'Le prix original doit être positif' }).optional()
  ),
  stock: z.preprocess(
    (val) => Number(val),
    z.number().int({ message: 'Le stock doit être un nombre entier' }).min(0, { message: 'Le stock ne peut pas être négatif' })
  ),
  image_url: z.string().url({ message: 'L\'URL de l\'image n\'est pas valide' }).optional().or(z.literal(''))
});

type ItemFormValues = z.infer<typeof itemFormSchema>;

interface AddItemFormProps {
  onSuccess?: (item: ShopItem) => void;
}

export function AddItemForm({ onSuccess }: AddItemFormProps) {
  const { addShopItem } = useShop();
  const [isFormVisible, setIsFormVisible] = useState(false);
  
  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      original_price: undefined,
      stock: 1,
      image_url: '',
    },
  });
  
  const onSubmit = async (values: ItemFormValues) => {
    const item = await addShopItem({
      name: values.name,
      description: values.description,
      price: values.price,
      original_price: values.original_price,
      stock: values.stock,
      image_url: values.image_url || undefined,
      status: 'available'
    });
    
    if (item) {
      form.reset();
      setIsFormVisible(false);
      
      if (onSuccess) {
        onSuccess(item);
      }
    }
  };
  
  if (!isFormVisible) {
    return (
      <div className="mt-6">
        <Button 
          onClick={() => setIsFormVisible(true)}
          className="w-full"
        >
          <Package className="h-4 w-4 mr-2" />
          Ajouter un nouvel article
        </Button>
      </div>
    );
  }
  
  return (
    <Card className="border shadow-sm mt-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Ajouter un article</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsFormVisible(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de l'article</FormLabel>
                    <FormControl>
                      <Input placeholder="T-shirt coton bio" {...field} />
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
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Décrivez votre article, ses caractéristiques, etc."
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix (€)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" {...field} />
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
                      <Input type="number" step="0.01" min="0" {...field} />
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
                      <Input type="number" min="0" step="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsFormVisible(false)}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Ajout en cours...' : 'Ajouter l\'article'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
