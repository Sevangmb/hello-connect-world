
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Settings, MapPin, Store, Check } from 'lucide-react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useShop } from '@/hooks/useShop';
import { Shop } from '@/core/shop/domain/types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function ShopSettings({ shop }: { shop: Shop }) {
  const { useUpdateShop } = useShop();
  const updateShopMutation = useUpdateShop();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: shop.name || '',
    description: shop.description || '',
    address: shop.address || '',
    phone: shop.phone || '',
    website: shop.website || '',
    categories: shop.categories || [],
    latitude: shop.latitude || 0,
    longitude: shop.longitude || 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoriesChange = (value: string) => {
    // Convertir la chaîne en tableau
    const categoriesArray = value.split(',').map(category => category.trim());
    setFormData(prev => ({ ...prev, categories: categoriesArray }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    setFormData(prev => ({ ...prev, [name]: isNaN(numValue) ? 0 : numValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateShopMutation.mutate({
        shopId: shop.id,
        data: formData
      });
      
      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres de votre boutique ont été mis à jour avec succès."
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour des paramètres:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour les paramètres de la boutique."
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Paramètres de la boutique
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informations générales</h3>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Nom de la boutique</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nom de votre boutique"
                />
              </div>
              
              <div>
                <Label htmlFor="categories">Catégories (séparées par des virgules)</Label>
                <Input
                  id="categories"
                  name="categories"
                  value={formData.categories.join(', ')}
                  onChange={(e) => handleCategoriesChange(e.target.value)}
                  placeholder="vêtements, accessoires, chaussures"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description de votre boutique"
                rows={4}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Adresse et contact
            </h3>
            
            <div>
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Adresse physique (si applicable)"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Numéro de téléphone"
                />
              </div>
              
              <div>
                <Label htmlFor="website">Site web</Label>
                <Input
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="URL de votre site web"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="0.000001"
                  value={formData.latitude}
                  onChange={handleLocationChange}
                  placeholder="Latitude"
                />
              </div>
              
              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="0.000001"
                  value={formData.longitude}
                  onChange={handleLocationChange}
                  placeholder="Longitude"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit"
              disabled={updateShopMutation.isPending}
              className="w-full sm:w-auto"
            >
              {updateShopMutation.isPending ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Enregistrer les modifications
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
