
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useShop } from '@/hooks/useShop';
import { useQueryClient } from '@tanstack/react-query';
import { Shop, DeliveryOption, PaymentMethod } from '@/core/shop/domain/types';
import { shopApiGateway } from '@/services/api-gateway/ShopApiGateway';

// Define form schema for validation
const shopSettingsSchema = z.object({
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  description: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  auto_accept_orders: z.boolean().optional(),
  delivery_options: z.array(z.string()).optional(),
  payment_methods: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof shopSettingsSchema>;

interface ShopSettingsProps {
  shop: Shop;
}

export function ShopSettings({ shop }: ShopSettingsProps) {
  const { toast } = useToast();
  const { useUpdateShop } = useShop();
  const { mutate: updateShop, isPending } = useUpdateShop();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(shopSettingsSchema),
    defaultValues: {
      name: shop.name || '',
      description: shop.description || '',
      address: shop.address || '',
      phone: shop.phone || '',
      website: shop.website || '',
      auto_accept_orders: false,
      delivery_options: [],
      payment_methods: [],
    },
  });

  // Helper function to handle array types
  const formatArrayField = (value: string | string[]): string[] => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string' && value.trim()) return value.split(',');
    return [];
  };

  const onSubmit = (values: FormValues) => {
    const deliveryOptions = formatArrayField(values.delivery_options);
    const paymentMethods = formatArrayField(values.payment_methods);

    updateShop(
      {
        shopId: shop.id,
        shopData: {
          ...values,
          delivery_options: deliveryOptions as DeliveryOption[],
          payment_methods: paymentMethods as PaymentMethod[],
        }
      },
      {
        onSuccess: () => {
          toast({
            title: "Paramètres mis à jour",
            description: "Les paramètres de votre boutique ont été mis à jour avec succès.",
          });
          setIsEditing(false);
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Une erreur est survenue lors de la mise à jour des paramètres.",
          });
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Paramètres de la boutique</CardTitle>
          <Button 
            variant={isEditing ? "outline" : "default"} 
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Annuler" : "Modifier"}
          </Button>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de la boutique</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom de la boutique" {...field} />
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
                        <Textarea placeholder="Description de la boutique" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse</FormLabel>
                      <FormControl>
                        <Input placeholder="Adresse" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone</FormLabel>
                        <FormControl>
                          <Input placeholder="Téléphone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site web</FormLabel>
                        <FormControl>
                          <Input placeholder="Site web" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="auto_accept_orders"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Acceptation automatique des commandes
                        </FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Enregistrement..." : "Enregistrer les modifications"}
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Nom de la boutique</h3>
                <p className="mt-1">{shop.name}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Description</h3>
                <p className="mt-1">{shop.description || "Aucune description"}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Adresse</h3>
                <p className="mt-1">{shop.address || "Aucune adresse"}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Téléphone</h3>
                  <p className="mt-1">{shop.phone || "Aucun numéro"}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium">Site web</h3>
                  <p className="mt-1">{shop.website || "Aucun site web"}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
