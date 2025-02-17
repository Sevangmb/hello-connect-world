import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClothesFormData } from "../types";

interface ClothesDetailsProps {
  formData: ClothesFormData;
  onFormChange: (field: keyof ClothesFormData, value: any) => void;
}

const DetailField = ({ id, label, value, onChange, placeholder, type = "text" }: { id: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string, type?: string }) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
    />
  </div>
);

export const ClothesDetails = ({ formData, onFormChange }: ClothesDetailsProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <DetailField
          id="brand"
          label="Marque"
          value={formData.brand}
          onChange={(e) => onFormChange('brand', e.target.value)}
          placeholder="Ex: Nike"
        />
        <DetailField
          id="size"
          label="Taille"
          value={formData.size}
          onChange={(e) => onFormChange('size', e.target.value)}
          placeholder="Ex: M"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <DetailField
          id="material"
          label="Matière"
          value={formData.material}
          onChange={(e) => onFormChange('material', e.target.value)}
          placeholder="Ex: 100% Coton"
        />
        <DetailField
          id="color"
          label="Couleur"
          value={formData.color}
          onChange={(e) => onFormChange('color', e.target.value)}
          placeholder="Ex: Bleu"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <DetailField
          id="purchase_date"
          label="Date d'achat"
          value={formData.purchase_date}
          onChange={(e) => onFormChange('purchase_date', e.target.value)}
          type="date"
        />
        <DetailField
          id="price"
          label="Prix d'achat"
          value={formData.price}
          onChange={(e) => onFormChange('price', e.target.value)}
          placeholder="Ex: 29.99"
          type="number"
          step="0.01"
        />
      </div>
    </>
  );
};
