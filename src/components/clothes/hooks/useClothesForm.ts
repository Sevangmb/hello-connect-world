
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ClothesFormData } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const initialFormData: ClothesFormData = {
  name: "",
  description: "",
  category: "",
  image_url: null,
  brand: "",
  size: "",
  material: "",
  color: "",
  style: "",
  price: null,
  purchase_date: "",
  is_for_sale: false,
  needs_alteration: false,
  weather_categories: [],
};

interface UseClothesFormProps {
  clothesId?: string;
  initialData?: ClothesFormData;
  onSuccess: () => void;
}

export const useClothesForm = ({ clothesId, initialData, onSuccess }: UseClothesFormProps) => {
  const [formData, setFormData] = useState<ClothesFormData>(initialData || initialFormData);
  const { toast } = useToast();
  const { user } = useAuth();
  const isEditing = Boolean(clothesId);

  const handleFormChange = (field: keyof ClothesFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    console.log("Form data updated:", field, value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      if (isEditing) {
        const priceValue = formData.price ? Number(formData.price) : null;
        
        const { error } = await supabase
          .from("clothes")
          .update({
            name: formData.name,
            description: formData.description,
            category: formData.category,
            brand: formData.brand,
            size: formData.size,
            material: formData.material,
            color: formData.color,
            style: formData.style,
            price: priceValue,
            purchase_date: formData.purchase_date,
            is_for_sale: formData.is_for_sale,
            needs_alteration: formData.needs_alteration,
            image_url: formData.image_url,
            weather_categories: formData.weather_categories,
            updated_at: new Date().toISOString(),
          })
          .eq("id", clothesId);

        if (error) throw error;

        toast({
          title: "Vêtement modifié",
          description: "Le vêtement a été modifié avec succès",
        });

        onSuccess();
      } else {
        const { error } = await supabase
          .from("clothes")
          .insert({
            user_id: user.id,
            name: formData.name,
            description: formData.description,
            category: formData.category,
            brand: formData.brand,
            size: formData.size,
            material: formData.material,
            color: formData.color,
            style: formData.style,
            price: Number(formData.price),
            purchase_date: formData.purchase_date || null,
            is_for_sale: formData.is_for_sale,
            needs_alteration: formData.needs_alteration,
            image_url: formData.image_url,
            weather_categories: formData.weather_categories,
          });

        if (error) throw error;

        toast({
          title: "Vêtement ajouté",
          description: "Le vêtement a été ajouté avec succès",
        });

        setFormData(initialFormData);
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error submitting clothes:", error.message);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: isEditing ? "Impossible de modifier le vêtement" : "Impossible d'ajouter le vêtement",
      });
    }
  };

  return {
    formData,
    handleFormChange,
    handleSubmit,
    isEditing,
  };
};
