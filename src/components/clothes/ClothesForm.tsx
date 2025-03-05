
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ClothesImageUpload from "./forms/ClothesImageUpload";
import { ClothesDetectionButtons } from "./components/ClothesDetectionButtons";
import { ClothesFormData } from "./types";
import { CATEGORIES, STYLES, WEATHER_CATEGORIES } from "./constants/categories";

interface ClothesFormProps {
  formData: ClothesFormData;
  onFormChange: (field: keyof ClothesFormData, value: any) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  clothesId?: string;
  onSuccess?: () => void;
}

export const ClothesForm = ({ formData, onFormChange, onSubmit }: ClothesFormProps) => {
  const [uploading, setUploading] = useState(false);

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Ajouter un vêtement</h2>
        <p className="text-muted-foreground">
          Entrez les informations du vêtement
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-4">
          <ClothesImageUpload
            onChange={(url) => onFormChange('image_url', url)}
            onUploading={setUploading}
            currentImageUrl={formData.image_url || ''}
          />

          {formData.image_url && (
            <ClothesDetectionButtons
              imageUrl={formData.image_url}
              onFormChange={onFormChange}
            />
          )}
        </div>

        <div>
          <Label htmlFor="name">Nom</Label>
          <Input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => onFormChange('name', e.target.value)}
            placeholder="Nom du vêtement"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => onFormChange('description', e.target.value)}
            placeholder="Description du vêtement"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="category">Catégorie</Label>
          <Select 
            value={formData.category}
            onValueChange={(value) => onFormChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="style">Style</Label>
          <Select 
            value={formData.style}
            onValueChange={(value) => onFormChange('style', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un style" />
            </SelectTrigger>
            <SelectContent>
              {STYLES.map((style) => (
                <SelectItem key={style} value={style}>
                  {style}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="weather">Météo</Label>
          <Select 
            value={formData.weather_categories?.length ? formData.weather_categories[0] : ''}
            onValueChange={(value) => onFormChange('weather_categories', [value])}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une météo" />
            </SelectTrigger>
            <SelectContent>
              {WEATHER_CATEGORIES.map((weather) => (
                <SelectItem key={weather} value={weather}>
                  {weather}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="brand">Marque</Label>
          <Input
            type="text"
            id="brand"
            value={formData.brand}
            onChange={(e) => onFormChange('brand', e.target.value)}
            placeholder="Marque du vêtement"
          />
        </div>

        <div>
          <Label htmlFor="size">Taille</Label>
          <Input
            type="text"
            id="size"
            value={formData.size}
            onChange={(e) => onFormChange('size', e.target.value)}
            placeholder="Taille du vêtement"
          />
        </div>

        <div>
          <Label htmlFor="color">Couleur</Label>
          <Input
            type="text"
            id="color"
            value={formData.color}
            onChange={(e) => onFormChange('color', e.target.value)}
            placeholder="Couleur du vêtement"
          />
        </div>

        <div>
          <Label htmlFor="material">Matière</Label>
          <Input
            type="text"
            id="material"
            value={formData.material}
            onChange={(e) => onFormChange('material', e.target.value)}
            placeholder="Matière du vêtement"
          />
        </div>

        <div>
          <Label htmlFor="purchase_date">Date d'achat</Label>
          <Input
            type="date"
            id="purchase_date"
            value={formData.purchase_date}
            onChange={(e) => onFormChange('purchase_date', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="price">Prix d'achat</Label>
          <Input
            type="number"
            id="price"
            value={formData.price || ''}
            onChange={(e) => onFormChange('price', parseFloat(e.target.value))}
            placeholder="Prix d'achat"
            step="0.01"
          />
        </div>

        <div>
          <Label htmlFor="is_for_sale">À vendre ?</Label>
          <input
            type="checkbox"
            id="is_for_sale"
            checked={formData.is_for_sale}
            onChange={(e) => onFormChange('is_for_sale', e.target.checked)}
          />
        </div>

        <div>
          <Label htmlFor="needs_alteration">Besoin d'être modifié ?</Label>
          <input
            type="checkbox"
            id="needs_alteration"
            checked={formData.needs_alteration}
            onChange={(e) => onFormChange('needs_alteration', e.target.checked)}
          />
        </div>

        <Button type="submit">
          Ajouter le vêtement
        </Button>
      </form>
    </div>
  );
};

export default ClothesForm;
