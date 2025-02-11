
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClothesFormData } from "../types";

interface ClothesBasicInfoProps {
  formData: ClothesFormData;
  onFormChange: (field: keyof ClothesFormData, value: any) => void;
  categories: string[];
  styles: string[];
}

export const ClothesBasicInfo = ({ formData, onFormChange, categories, styles }: ClothesBasicInfoProps) => {
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
            onValueChange={(value) => onFormChange('category', value)}
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
