import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useShop } from '@/hooks/useShop';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Shop, ShopSettings as ShopSettingsType } from '@/core/shop/domain/types';

const shopFormSchema = z.object({
  name: z.string().min(2, {
    message: "Shop name must be at least 2 characters.",
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
  const { shop } = useShop();

  const shopData = shop || {
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
      categories: shopData?.categories || "",
    },
  });

  const { mutate: updateShop, isLoading } = useUpdateShop();

  const handleSubmit = (data: ShopFormValues) => {
    updateShop({
      id: shop.id,
      data: {
        name: data.name,
        description: data.description,
        address: data.address,
        phone: data.phone,
        website: data.website,
        categories: data.categories,
        // Don't include settings here, it should be handled separately
      }
    });
  };

  return (
    <div className="container max-w-3xl">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Shop Information</h3>
          <p className="text-sm text-muted-foreground">
            Update your shop information here.
          </p>
        </div>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-1 gap-2">
              <label htmlFor="name" className="text-sm font-medium leading-none">
                Shop Name
              </label>
              <Input id="name" type="text" placeholder="Shop Name" {...form.register("name")} />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <label htmlFor="description" className="text-sm font-medium leading-none">
                Description
              </label>
              <Textarea id="description" placeholder="Description" {...form.register("description")} />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <label htmlFor="address" className="text-sm font-medium leading-none">
                Address
              </label>
              <Input id="address" type="text" placeholder="Address" {...form.register("address")} />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <label htmlFor="phone" className="text-sm font-medium leading-none">
                Phone
              </label>
              <Input id="phone" type="text" placeholder="Phone" {...form.register("phone")} />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <label htmlFor="website" className="text-sm font-medium leading-none">
                Website
              </label>
              <Input id="website" type="text" placeholder="Website" {...form.register("website")} />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <label htmlFor="categories" className="text-sm font-medium leading-none">
                Categories
              </label>
              <Input id="categories" type="text" placeholder="Categories" {...form.register("categories")} />
            </div>
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Shop"}
          </Button>
        </form>
      </div>
    </div>
  );
}

const useUpdateShop = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { updateShop } = useShop();

  return useMutation(
    async ({ id, data }: { id: string; data: Partial<Shop> }) => {
      if (!updateShop) {
        throw new Error("Update shop mutation not available");
      }
      return await updateShop(id, data);
    },
    {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Shop updated successfully.",
        });
        queryClient.invalidateQueries(["shops"]);
      },
      onError: (error: any) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      },
    }
  );
};
