
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
import { useAuth } from '@/hooks/useAuth';

const formSchema = z.object({
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  image_url: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateShopForm() {
  const { user } = useAuth();
  const { createShop } = useShop(user?.id || null);
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      image_url: '',
    },
  });
  
  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Vous devez être connecté pour créer une boutique.',
      });
      return;
    }
    
    try {
      await createShop.mutateAsync({
        user_id: user.id,
        name: values.name,
        description: values.description,
        image_url: values.image_url,
        status: 'pending'
      });
      
      toast({
        title: 'Boutique créée',
        description: 'Votre demande de création de boutique a été soumise avec succès. Elle est en cours d\'examen.',
      });
    } catch (error) {
      console.error('Erreur lors de la création de la boutique:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de créer votre boutique. Veuillez réessayer.',
      });
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo de votre boutique</FormLabel>
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
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de votre boutique</FormLabel>
              <FormControl>
                <Input placeholder="Ma boutique géniale" {...field} />
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
                  placeholder="Décrivez votre boutique, vos produits et votre passion..."
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isUploading || createShop.isPending}>
          {createShop.isPending ? 'En cours...' : 'Créer ma boutique'}
        </Button>
        
        <p className="text-xs text-muted-foreground">
          Votre demande sera examinée par notre équipe avant d'être approuvée.
        </p>
      </form>
    </Form>
  );
}
