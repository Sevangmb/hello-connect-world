import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ShopItemStatus } from '@/core/shop/domain/types';
import { useShop } from '@/hooks/useShop';
import { supabase } from '@/integrations/supabase/client';

interface AddItemFormProps {
  shopId: string;
  onSuccess?: () => void;
}

export function AddItemForm({ shopId, onSuccess }: AddItemFormProps) {
  const { useAddShopItems } = useShop();
  const addItemMutation = useAddShopItems();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      original_price: 0,
      stock: 1,
      status: 'available' as ShopItemStatus,
      clothes_id: '',
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return '';
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Non authentifié");
      
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `shop-items/${shopId}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('shop-items')
        .upload(filePath, imageFile);
        
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage
        .from('shop-items')
        .getPublicUrl(filePath);
        
      return urlData.publicUrl;
    } catch (error) {
      console.error("Erreur lors de l'upload de l'image:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de télécharger l'image. Veuillez réessayer.",
      });
      return '';
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const imageUrl = await uploadImage();
      
      // Préparer les données de l'item avec shopId
      const itemData = {
        ...data,
        image_url: imageUrl,
        shop_id: shopId
      };
      
      // Utiliser la mutation pour créer l'item
      await addItemMutation.mutate({ 
        shopId, 
        item: itemData 
      });
      
      // Réinitialiser le formulaire
      reset();
      setImageFile(null);
      setImagePreview(null);
      
      // Notifier le succès
      toast({
        title: "Article ajouté",
        description: "L'article a été ajouté à votre boutique avec succès.",
      });
      
      // Appeler le callback de succès si fourni
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'article:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter l'article. Veuillez réessayer.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nom de l'article</Label>
            <Input
              id="name"
              {...register('name', { required: "Le nom est requis" })}
              placeholder="Nom de l'article"
              error={errors.name?.message}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Description de l'article"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="price">Prix (€)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register('price', { 
                  required: "Le prix est requis",
                  min: { value: 0, message: "Le prix doit être positif" }
                })}
              />
              {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="original_price">Prix original (€)</Label>
              <Input
                id="original_price"
                type="number"
                step="0.01"
                {...register('original_price')}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="stock">Quantité en stock</Label>
              <Input
                id="stock"
                type="number"
                {...register('stock', { 
                  required: "Le stock est requis",
                  min: { value: 0, message: "Le stock doit être positif" }
                })}
              />
              {errors.stock && <p className="text-sm text-red-500">{errors.stock.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="status">Statut</Label>
              <Select
                onValueChange={(value) => setValue('status', value as ShopItemStatus)}
                defaultValue="available"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Disponible</SelectItem>
                  <SelectItem value="sold_out">Épuisé</SelectItem>
                  <SelectItem value="archived">Archivé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="image">Image de l'article</Label>
            <div className="flex items-center justify-center border-2 border-dashed rounded-md p-4 h-64">
              {imagePreview ? (
                <div className="relative w-full h-full">
                  <img 
                    src={imagePreview} 
                    alt="Aperçu" 
                    className="object-contain w-full h-full"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-0 right-0"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                  >
                    Supprimer
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">
                    JPG, PNG ou GIF jusqu'à 10MB
                  </p>
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Button type="button" variant="outline">Choisir une image</Button>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="clothes_id">ID vêtement associé (optionnel)</Label>
            <Input
              id="clothes_id"
              {...register('clothes_id')}
              placeholder="ID de vêtement si applicable"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={addItemMutation.isPending}
          className="w-full md:w-auto"
        >
          {addItemMutation.isPending ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Création en cours...
            </>
          ) : (
            'Ajouter l\'article'
          )}
        </Button>
      </div>
    </form>
  );
}
