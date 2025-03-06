
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';
import { ShopItem } from '@/core/shop/domain/types';
import { useShop } from '@/hooks/useShop';
import { uploadFile } from '@/integrations/supabase/storage';

interface AddItemFormProps {
  shopId: string;
  onSuccess?: () => void;
}

export const AddItemForm: React.FC<AddItemFormProps> = ({ shopId, onSuccess }) => {
  const [formData, setFormData] = useState<Partial<ShopItem>>({
    shop_id: shopId,
    name: '',
    description: '',
    price: 0,
    original_price: 0,
    stock: 1,
    status: 'available',
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { useCreateShopItem } = useShop();
  const createShopItemMutation = useCreateShopItem();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'price' || name === 'original_price' || name === 'stock' ? parseFloat(value) : value });
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = '';
      
      // Upload image if selected
      if (image) {
        const filename = `${Date.now()}-${image.name}`;
        const path = `shop_items/${shopId}/${filename}`;
        const { data, error } = await uploadFile('shop_images', path, image);
        
        if (error) throw error;
        imageUrl = data.publicURL;
      }
      
      // Create shop item with image URL
      const itemWithImage = {
        ...formData,
        image_url: imageUrl || undefined
      };
      
      await createShopItemMutation.mutateAsync(itemWithImage);
      
      toast({
        title: "Article ajouté",
        description: "L'article a été ajouté à votre boutique avec succès."
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error adding shop item:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'ajout de l'article."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom de l'article</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleInputChange}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Prix (€)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            min={0}
            step={0.01}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="original_price">Prix initial (€)</Label>
          <Input
            id="original_price"
            name="original_price"
            type="number"
            value={formData.original_price || ''}
            onChange={handleInputChange}
            min={0}
            step={0.01}
            placeholder="Optionnel"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleInputChange}
            min={0}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Statut</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => handleSelectChange(value, 'status')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Disponible</SelectItem>
            <SelectItem value="sold_out">Épuisé</SelectItem>
            <SelectItem value="archived">Archivé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center">
            <label htmlFor="imageUpload" className="cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4 hover:border-primary transition-colors">
                <div className="flex flex-col items-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-500">Cliquez pour choisir une image</span>
                </div>
              </div>
              <input
                id="imageUpload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-40 rounded-md object-contain"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              En cours...
            </>
          ) : (
            'Ajouter l\'article'
          )}
        </Button>
      </div>
    </form>
  );
};
