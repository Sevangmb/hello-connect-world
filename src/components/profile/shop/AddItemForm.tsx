import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useShop } from '@/hooks/useShop';
import { ShopItem, ShopItemStatus } from '@/core/shop/domain/types';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Le nom doit comporter au moins 2 caractères.',
  }),
  description: z.string().optional(),
  price: z.string().refine((value) => {
    const num = Number(value);
    return !isNaN(num) && num > 0;
  }, {
    message: 'Le prix doit être un nombre valide supérieur à zéro.',
  }),
  originalPrice: z.string().optional(),
  stock: z.string().refine((value) => {
    const num = Number(value);
    return !isNaN(num) && num >= 0;
  }, {
    message: 'Le stock doit être un nombre entier valide supérieur ou égal à zéro.',
  }),
  imageUrl: z.string().optional(),
  clothesId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const useCreateShopItemMutation = () => {
  const { useCreateShopItem } = useShop(); // Ensure this hook is properly implemented
  return useCreateShopItem ? useCreateShopItem() : {
    mutate: (data: { shopId: string, item: Omit<ShopItem, "id" | "created_at" | "updated_at"> }) => {
      console.error("useCreateShopItem hook is not available");
    },
    isLoading: false,
    isError: false,
    error: null
  };
};

interface AddItemFormProps {
  shop: { id: string } | undefined;
}

export function AddItemForm({ shop }: AddItemFormProps) {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      stock: '',
      imageUrl: '',
      clothesId: '',
    },
  });

  const createShopItemMutation = useCreateShopItemMutation();

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    if (!shop?.id) {
      toast({
        title: 'Erreur',
        description: 'Boutique non trouvée.',
        variant: 'destructive',
      });
      return;
    }

    createShopItemMutation.mutate({
      shopId: shop?.id || '',  // Use shopId, not shop_id
      item: {
        name: values.name,
        description: values.description,
        price: Number(values.price),
        original_price: values.originalPrice ? Number(values.originalPrice) : undefined,
        stock: Number(values.stock),
        image_url: values.imageUrl,
        status: 'available' as ShopItemStatus,
        clothes_id: values.clothesId
      }
    });

    toast({
      title: 'Succès',
      description: 'Article ajouté avec succès.',
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Nom de l'article</Label>
        <Input id="name" type="text" {...register('name')} />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register('description')} />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="price">Prix</Label>
        <Input id="price" type="text" {...register('price')} />
        {errors.price && (
          <p className="text-red-500 text-sm">{errors.price.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="originalPrice">Prix original (optionnel)</Label>
        <Input id="originalPrice" type="text" {...register('originalPrice')} />
        {errors.originalPrice && (
          <p className="text-red-500 text-sm">{errors.originalPrice.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="stock">Stock</Label>
        <Input id="stock" type="text" {...register('stock')} />
        {errors.stock && (
          <p className="text-red-500 text-sm">{errors.stock.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="imageUrl">URL de l'image (optionnel)</Label>
        <Input id="imageUrl" type="text" {...register('imageUrl')} />
        {errors.imageUrl && (
          <p className="text-red-500 text-sm">{errors.imageUrl.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="clothesId">ID du vêtement (optionnel)</Label>
        <Input id="clothesId" type="text" {...register('clothesId')} />
        {errors.clothesId && (
          <p className="text-red-500 text-sm">{errors.clothesId.message}</p>
        )}
      </div>
      <Button type="submit" disabled={createShopItemMutation.isLoading}>
        {createShopItemMutation.isLoading ? 'Ajout en cours...' : 'Ajouter l\'article'}
      </Button>
    </form>
  );
}
