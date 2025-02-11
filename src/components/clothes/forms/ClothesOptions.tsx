
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ClothesFormData } from "../types";

interface ClothesOptionsProps {
  formData: ClothesFormData;
  onFormChange: (field: keyof ClothesFormData, value: any) => void;
}

export const ClothesOptions = ({ formData, onFormChange }: ClothesOptionsProps) => {
  return (
    <div className="flex items-center justify-between space-x-2">
      <div className="flex items-center space-x-2">
        <Switch
          id="is_for_sale"
          checked={formData.is_for_sale}
          onCheckedChange={(checked) => onFormChange('is_for_sale', checked)}
        />
        <Label htmlFor="is_for_sale" className="cursor-pointer">À vendre</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="needs_alteration"
          checked={formData.needs_alteration}
          onCheckedChange={(checked) => onFormChange('needs_alteration', checked)}
        />
        <Label htmlFor="needs_alteration" className="cursor-pointer">Nécessite des retouches</Label>
      </div>
    </div>
  );
};
