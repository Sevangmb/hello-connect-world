
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useShop } from '@/hooks/useShop';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Shop } from '@/core/shop/domain/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const shopFormSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom de la boutique doit contenir au moins 2 caractères.",
  }),
  description: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  categories: z.string().optional(),
});

type ShopFormValues = z.infer<typeof shopFormSchema>;

export function ShopSettings() {
  const { toast } = useToast();
  const { useUserShop } = useShop();
  const { data: userShop, isLoading: isShopLoading } = useUserShop();

  const shopData = userShop || {
    name: '',
    description: '',
    address: '',
    phone: '',
    website: '',
    categories: '',
  };

  const form = useForm<ShopFormValues>({
    resolver: zodResolver(shopFormSchema),
    defaultValues: {
      name: shopData?.name || "",
      description: shopData?.description || "",
      address: shopData?.address || "",
      phone: shopData?.phone || "",
      website: shopData?.website || "",
      categories: shopData?.categories ? shopData.categories.join(', ') : "",
    },
  });

  const updateShopMutation = useUpdateShop();

  const handleSubmit = (data: ShopFormValues) => {
    if (!userShop?.id) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de trouver votre boutique",
      });
      return;
    }

    const categories = data.categories
      ? data.categories.split(',').map(cat => cat.trim())
      : [];

    updateShopMutation.mutate({
      id: userShop.id,
      data: {
        name: data.name,
        description: data.description,
        address: data.address,
        phone: data.phone,
        website: data.website,
        categories
      }
    });
  };

  return (
    <div className="container max-w-3xl">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Informations de la boutique</h3>
          <p className="text-sm text-muted-foreground">
            Mettez à jour les informations de votre boutique ici.
          </p>
        </div>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-1 gap-2">
              <label htmlFor="name" className="text-sm font-medium leading-none">
                Nom de la boutique
              </label>
              <Input id="name" type="text" placeholder="Nom de la boutique" {...form.register("name")} />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <label htmlFor="description" className="text-sm font-medium leading-none">
                Description
              </label>
              <Textarea id="description" placeholder="Description" {...form.register("description")} />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <label htmlFor="address" className="text-sm font-medium leading-none">
                Adresse
              </label>
              <Input id="address" type="text" placeholder="Adresse" {...form.register("address")} />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <label htmlFor="phone" className="text-sm font-medium leading-none">
                Téléphone
              </label>
              <Input id="phone" type="text" placeholder="Téléphone" {...form.register("phone")} />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <label htmlFor="website" className="text-sm font-medium leading-none">
                Site web
              </label>
              <Input id="website" type="text" placeholder="Site web" {...form.register("website")} />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <label htmlFor="categories" className="text-sm font-medium leading-none">
                Catégories (séparées par des virgules)
              </label>
              <Input id="categories" type="text" placeholder="Catégories" {...form.register("categories")} />
            </div>
          </div>
          <Button type="submit" disabled={updateShopMutation.isPending}>
            {updateShopMutation.isPending ? "Mise à jour..." : "Mettre à jour la boutique"}
          </Button>
        </form>
      </div>
    </div>
  );
}

const useUpdateShop = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { useShopById } = useShop();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Shop> }) => {
      const shopApiGateway = new ShopApiGateway();
      return await shopApiGateway.updateShop(id, data);
    },
    meta: {
      onSuccess: () => {
        toast({
          title: "Succès",
          description: "Boutique mise à jour avec succès.",
        });
        queryClient.invalidateQueries({ queryKey: ["userShop"] });
      },
      onError: (error: any) => {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: error.message || "Erreur lors de la mise à jour de la boutique",
        });
      },
    }
  });
};
