import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useShop } from '@/hooks/useShop';
import { ShopItem, ShopItemStatus } from '@/core/shop/domain/types';
import { uploadImage } from '@/integrations/supabase/storage';
import { ImageIcon } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  description: z.string().optional(),
  price: z.string().refine((value) => {
    try {
      const num = parseFloat(value);
      return !isNaN(num) && num > 0;
    } catch (e) {
      return false;
    }
  }, {
    message: "Le prix doit être un nombre valide supérieur à zéro.",
  }),
  originalPrice: z.string().optional(),
  stock: z.string().refine((value) => {
    try {
      const num = parseInt(value, 10);
      return !isNaN(num) && num >= 0;
    } catch (e) {
      return false;
    }
  }, {
    message: "Le stock doit être un nombre entier valide supérieur ou égal à zéro.",
  }),
  clothesId: z.string().optional(),
});

interface AddItemFormProps {
  shopId: string;
  onSuccess?: () => void;
}

export function AddItemForm({ shopId, onSuccess }: AddItemFormProps) {
  const { toast } = useToast();
  const { addShopItems } = useShop();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { profile } = useProfile();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      originalPrice: "",
      stock: "",
      clothesId: "",
    },
  })

  const onImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner une image.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const url = await uploadImage(file, `shop-items/${profile?.username}`);
      setImageUrl(url);
      toast({
        title: "Succès",
        description: "Image téléchargée avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors du téléchargement de l'image :", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors du téléchargement de l'image.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);

    try {
      const formData: Omit<ShopItem, "id" | "created_at" | "updated_at"> = {
        shop_id: shopId,
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        original_price: data.originalPrice ? parseFloat(data.originalPrice) : undefined,
        stock: parseInt(data.stock, 10),
        status: 'available' as ShopItemStatus,
        image_url: imageUrl || undefined,
        clothes_id: data.clothesId || undefined
      };

      const success = await addShopItems([formData]);

      if (success) {
        toast({
          title: "Succès",
          description: "Article ajouté avec succès.",
        });
        form.reset();
        setImageUrl(null);
        onSuccess?.();
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Erreur lors de l'ajout de l'article.",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire :", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors de la soumission du formulaire.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ajouter un article</CardTitle>
        <CardDescription>Ajouter un nouvel article à votre boutique.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom de l'article" {...field} />
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
                      placeholder="Description de l'article"
                      className="resize-none"
                      {...field}
                    />
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
                    <Input placeholder="Prix de l'article" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="originalPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix original</FormLabel>
                  <FormControl>
                    <Input placeholder="Prix original de l'article" type="number" {...field} />
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
                    <Input placeholder="Stock de l'article" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clothesId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Clothes ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Clothes ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col space-y-2">
              <FormLabel>Image de l'article</FormLabel>
              <Input type="file" id="image" accept="image/*" onChange={onImageUpload} />
              {imageUrl && (
                <img src={imageUrl} alt="Article" className="mt-2 rounded-md object-cover w-32 h-32" />
              )}
              {!imageUrl && (
                <div className="flex items-center justify-center w-32 h-32 mt-2 rounded-md bg-muted">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Envoi..." : "Ajouter l'article"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
