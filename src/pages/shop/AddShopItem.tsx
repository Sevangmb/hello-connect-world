
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { PageLayout } from "@/components/layouts/PageLayout";
import { ClothesImageUpload } from "@/components/clothes/forms/ClothesImageUpload";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(2, "Le nom doit faire au moins 2 caractères"),
  description: z.string().optional(),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Le prix doit être un nombre positif",
  }),
  original_price: z.string().optional(),
  image_url: z.string().optional(),
  category: z.string().optional(),
  size: z.string().optional(),
  brand: z.string().optional(),
});

export default function AddShopItem() {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      original_price: "",
      category: "",
      size: "",
      brand: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user || !shopId) return;

    try {
      // First, create the clothes entry
      const { data: clothes, error: clothesError } = await supabase
        .from("clothes")
        .insert({
          name: values.name,
          description: values.description,
          image_url: imageUrl,
          category: values.category || null,
          size: values.size || null,
          brand: values.brand || null,
          user_id: user.id,
          is_for_sale: true,
          original_price: values.original_price ? Number(values.original_price) : null,
        })
        .select()
        .single();

      if (clothesError) throw clothesError;

      // Then create the shop item
      const { error: shopItemError } = await supabase
        .from("shop_items")
        .insert({
          shop_id: shopId,
          clothes_id: clothes.id,
          price: Number(values.price),
          original_price: values.original_price ? Number(values.original_price) : null,
          status: "available",
        });

      if (shopItemError) throw shopItemError;

      toast({
        title: "Article ajouté",
        description: "L'article a été ajouté à votre boutique avec succès",
      });

      navigate(`/shops/${shopId}`);
    } catch (error) {
      console.error("Error adding shop item:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de l'article",
        variant: "destructive",
      });
    }
  };

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Ajouter un article</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de l'article</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: T-shirt blanc" {...field} />
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
                      placeholder="Décrivez votre article..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="29.99"
                        {...field}
                      />
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
                        step="0.01"
                        min="0"
                        placeholder="39.99"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: T-shirt" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taille</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: M" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marque</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Nike" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <ClothesImageUpload
              onImageUrlChange={setImageUrl}
              onUploadStateChange={setUploading}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/shops/${shopId}`)}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={uploading}>
                Ajouter l'article
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </PageLayout>
  );
}
