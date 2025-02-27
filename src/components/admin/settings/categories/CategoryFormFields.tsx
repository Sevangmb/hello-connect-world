
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CategoryFormData {
  type: string;
  name: string;
  description?: string;
  icon?: string;
  order_index: number;
  is_active: boolean;
}

interface CategoryFormFieldsProps {
  formData: CategoryFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function CategoryFormFields({ formData, handleChange }: CategoryFormFieldsProps) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="type" className="text-right">
          Type
        </Label>
        <Input
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="col-span-3"
          placeholder="product, blog, event..."
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Nom
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="col-span-3"
          placeholder="Nom de la catégorie"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          className="col-span-3"
          placeholder="Description de la catégorie"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="icon" className="text-right">
          Icône
        </Label>
        <Input
          id="icon"
          name="icon"
          value={formData.icon || ""}
          onChange={handleChange}
          className="col-span-3"
          placeholder="Nom de l'icône (ex: shopping-bag)"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="order_index" className="text-right">
          Ordre
        </Label>
        <Input
          id="order_index"
          name="order_index"
          type="number"
          value={formData.order_index}
          onChange={handleChange}
          className="col-span-3"
          min={0}
        />
      </div>
    </div>
  );
}
