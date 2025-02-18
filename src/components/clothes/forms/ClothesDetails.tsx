
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClothesFormData } from "../types";

interface ClothesDetailsProps {
  formData: ClothesFormData;
  onFormChange: (field: keyof ClothesFormData, value: any) => void;
}

export function ClothesDetails({ formData, onFormChange }: ClothesDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="brand">Marque</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) => onFormChange('brand', e.target.value)}
            placeholder="Ex: Nike"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="size">Taille</Label>
          <Input
            id="size"
            value={formData.size}
            onChange={(e) => onFormChange('size', e.target.value)}
            placeholder="Ex: M"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="material">Matière</Label>
          <Input
            id="material"
            value={formData.material}
            onChange={(e) => onFormChange('material', e.target.value)}
            placeholder="Ex: Coton"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="color">Couleur</Label>
          <Input
            id="color"
            value={formData.color}
            onChange={(e) => onFormChange('color', e.target.value)}
            placeholder="Ex: Bleu"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Prix d'achat</Label>
        <Input
          id="price"
          type="number"
          value={formData.price}
          onChange={(e) => onFormChange('price', e.target.value.toString())}
          placeholder="Ex: 49.99"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="purchase_date">Date d'achat</Label>
        <Input
          id="purchase_date"
          type="date"
          value={formData.purchase_date}
          onChange={(e) => onFormChange('purchase_date', e.target.value)}
        />
      </div>
    </div>
  );
}
