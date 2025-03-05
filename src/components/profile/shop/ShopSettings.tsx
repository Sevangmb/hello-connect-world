
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ImageUpload } from '@/components/ui/image-upload';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useShop } from '@/hooks/useShop';

interface ShopSettingsProps {
  shopId: string;
}

const formSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  description: z.string(),
  phone: z.string().optional(),
  website: z.string().url('Veuillez entrer une URL valide').optional().or(z.literal('')),
  image_url: z.string().optional(),
  address: z.string().optional(),
  payment_methods: z.array(z.string()),
  delivery_options: z.array(z.string()),
  auto_accept_orders: z.boolean().default(false),
});

export function ShopSettings({ shopId }: ShopSettingsProps) {
  const { shop, isShopLoading, updateShopInfo, getShopSettings, updateShopSettings } = useShop(null);
  const { data: settings, isLoading: isSettingsLoading } = getShopSettings(shopId);
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      phone: '',
      website: '',
      image_url: '',
      address: '',
      payment_methods: [],
      delivery_options: [],
      auto_accept_orders: false,
    },
  });
  
  useEffect(() => {
    if (shop && settings) {
      form.reset({
        name: shop.name,
        description: shop.description,
        phone: shop.phone || '',
        website: shop.website || '',
        image_url: shop.image_url || '',
        address: shop.address || '',
        payment_methods: settings.payment_methods || [],
        delivery_options: settings.delivery_options || [],
        auto_accept_orders: settings.auto_accept_orders || false,
      });
    }
  }, [shop, settings, form]);
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Update shop info
      await updateShopInfo.mutateAsync({
        id: shopId,
        name: values.name,
        description: values.description,
        image_url: values.image_url,
        phone: values.phone,
        website: values.website,
        address: values.address,
      });
      
      // Update shop settings
      await updateShopSettings.mutateAsync({
        shop_id: shopId,
        payment_methods: values.payment_methods,
        delivery_options: values.delivery_options,
        auto_accept_orders: values.auto_accept_orders,
      });
      
      toast({
        title: 'Paramètres mis à jour',
        description: 'Les paramètres de votre boutique ont été mis à jour avec succès.',
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour des paramètres:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de mettre à jour les paramètres. Veuillez réessayer.',
      });
    }
  };
  
  if (isShopLoading || isSettingsLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  const paymentMethods = [
    { id: 'card', label: 'Carte bancaire' },
    { id: 'paypal', label: 'PayPal' },
    { id: 'bank_transfer', label: 'Virement bancaire' },
    { id: 'cash', label: 'Paiement à la livraison' },
  ];
  
  const deliveryOptions = [
    { id: 'pickup', label: 'Retrait en boutique' },
    { id: 'delivery', label: 'Livraison à domicile' },
  ];
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Informations de la boutique</CardTitle>
            <CardDescription>
              Gérez les informations principales de votre boutique.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo de la boutique</FormLabel>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de la boutique</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input {...field} />
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
                      <Input {...field} />
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
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Options de paiement et livraison</CardTitle>
            <CardDescription>
              Configurez comment vos clients peuvent payer et recevoir leurs commandes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="payment_methods"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Méthodes de paiement acceptées</FormLabel>
                    <FormDescription>
                      Sélectionnez les méthodes de paiement que vous acceptez.
                    </FormDescription>
                  </div>
                  {paymentMethods.map((method) => (
                    <FormField
                      key={method.id}
                      control={form.control}
                      name="payment_methods"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={method.id}
                            className="flex flex-row items-start space-x-3 space-y-0 mb-2"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(method.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, method.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== method.id
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {method.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="delivery_options"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Options de livraison</FormLabel>
                    <FormDescription>
                      Sélectionnez les options de livraison que vous proposez.
                    </FormDescription>
                  </div>
                  {deliveryOptions.map((option) => (
                    <FormField
                      key={option.id}
                      control={form.control}
                      name="delivery_options"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={option.id}
                            className="flex flex-row items-start space-x-3 space-y-0 mb-2"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(option.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, option.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== option.id
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {option.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="auto_accept_orders"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Confirmation automatique des commandes
                    </FormLabel>
                    <FormDescription>
                      Les commandes seront automatiquement confirmées dès réception.
                    </FormDescription>
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
          </CardContent>
        </Card>
        
        <Button type="submit" disabled={isUploading || updateShopInfo.isPending || updateShopSettings.isPending}>
          {updateShopInfo.isPending || updateShopSettings.isPending
            ? 'Enregistrement...'
            : 'Enregistrer les modifications'}
        </Button>
      </form>
    </Form>
  );
}
