
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClothesFormData } from "../types";
import { useEffect } from "react";

interface ClothesBasicInfoProps {
  formData: ClothesFormData;
  onFormChange: (field: keyof ClothesFormData, value: any) => void;
  categories: string[];
  styles: string[];
}

const SUBCATEGORIES = {
  "Hauts": ["T-shirt", "Chemise", "Pull", "Sweat", "Top"],
  "Bas": ["Pantalon", "Jean", "Short", "Jupe"],
  "Robes": ["Robe courte", "Robe longue", "Robe de soirée"],
  "Manteaux": ["Manteau", "Veste", "Blazer", "Imperméable"],
  "Chaussures": ["Baskets", "Bottes", "Sandales", "Escarpins"],
  "Accessoires": ["Sac", "Bijoux", "Ceinture", "Écharpe"]
};

export const ClothesBasicInfo = ({ formData, onFormChange, categories, styles }: ClothesBasicInfoProps) => {
  // Mettre à jour la sous-catégorie quand la catégorie change
  useEffect(() => {
    if (formData.category && !formData.subcategory && SUBCATEGORIES[formData.category]) {
      onFormChange('subcategory', SUBCATEGORIES[formData.category][0]);
    }
  }, [formData.category]);

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Nom</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onFormChange('name', e.target.value)}
          placeholder="Ex: T-shirt blanc"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description"
          value={formData.description}
          onChange={(e) => onFormChange('description', e.target.value)}
          placeholder="Description du vêtement..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Catégorie</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => {
              onFormChange('category', value);
              // Réinitialiser la sous-catégorie
              if (SUBCATEGORIES[value]) {
                onFormChange('subcategory', SUBCATEGORIES[value][0]);
              }
            }}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {formData.category && SUBCATEGORIES[formData.category] && (
          <div className="space-y-2">
            <Label htmlFor="subcategory">Sous-catégorie</Label>
            <Select
              value={formData.subcategory || ''}
              onValueChange={(value) => onFormChange('subcategory', value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une sous-catégorie" />
              </SelectTrigger>
              <SelectContent>
                {SUBCATEGORIES[formData.category].map((subcat) => (
                  <SelectItem key={subcat} value={subcat}>
                    {subcat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="style">Style</Label>
          <Select
            value={formData.style}
            onValueChange={(value) => onFormChange('style', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un style" />
            </SelectTrigger>
            <SelectContent>
              {styles.map((style) => (
                <SelectItem key={style} value={style}>
                  {style}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};
