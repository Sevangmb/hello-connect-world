
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ClothesForm from "./ClothesForm";
import { ClothesFormData } from "./types";

type Clothes = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  image_url: string | null;
  brand: string | null;
  size: string | null;
  material: string | null;
  color: string | null;
  style: string | null;
  price: number | null;
  purchase_date: string | null;
  is_for_sale: boolean;
  needs_alteration: boolean;
  weather_categories: string[];
};

type EditClothesDialogProps = {
  clothes: Clothes;
  trigger: React.ReactNode;
};

export const EditClothesDialog = ({ clothes, trigger }: EditClothesDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ClothesFormData>({
    name: clothes.name,
    description: clothes.description || "",
    category: clothes.category,
    image_url: clothes.image_url,
    brand: clothes.brand || "",
    size: clothes.size || "",
    material: clothes.material || "",
    color: clothes.color || "",
    style: clothes.style || "",
    price: clothes.price,
    purchase_date: clothes.purchase_date || "",
    is_for_sale: clothes.is_for_sale,
    needs_alteration: clothes.needs_alteration,
    weather_categories: clothes.weather_categories || [],
  });

  const handleFormChange = (field: keyof ClothesFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically update the clothes data
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le vêtement</DialogTitle>
        </DialogHeader>
        <ClothesForm
          formData={formData}
          onFormChange={handleFormChange}
          onSubmit={handleSubmit}
          onSuccess={() => setOpen(false)}
          clothesId={clothes.id}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditClothesDialog;
