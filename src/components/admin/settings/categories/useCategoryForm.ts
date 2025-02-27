
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Category {
  id: string;
  type: string;
  name: string;
  description: string;
  icon: string;
  order_index: number;
  is_active: boolean;
}

export type CategoryFormData = Omit<Category, "id">;

export function useCategoryForm(category?: Category, onSave?: () => void, onClose?: (open: boolean) => void) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CategoryFormData>({
    type: "",
    name: "",
    description: "",
    icon: "",
    order_index: 0,
    is_active: true,
  });

  useEffect(() => {
    if (category) {
      setFormData({
        type: category.type,
        name: category.name,
        description: category.description || "",
        icon: category.icon || "",
        order_index: category.order_index,
        is_active: category.is_active,
      });
    } else {
      // Reset form for new category
      setFormData({
        type: "",
        name: "",
        description: "",
        icon: "",
        order_index: 0,
        is_active: true,
      });
    }
  }, [category]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      if (!formData.name || !formData.type) {
        throw new Error("Le nom et le type sont requis");
      }

      if (category) {
        // Update existing category
        const { error } = await supabase
          .from("site_categories")
          .update({
            type: formData.type,
            name: formData.name,
            description: formData.description,
            icon: formData.icon,
            order_index: formData.order_index,
            is_active: formData.is_active,
            updated_at: new Date().toISOString() // Convert Date to ISO string
          })
          .eq("id", category.id);

        if (error) throw error;
        toast({
          title: "Catégorie mise à jour",
          description: "La catégorie a été mise à jour avec succès.",
        });
      } else {
        // Create new category
        const { error } = await supabase.from("site_categories").insert({
          type: formData.type,
          name: formData.name,
          description: formData.description,
          icon: formData.icon,
          order_index: formData.order_index,
          is_active: formData.is_active,
        });

        if (error) throw error;
        toast({
          title: "Catégorie ajoutée",
          description: "La nouvelle catégorie a été créée avec succès.",
        });
      }

      if (onSave) onSave();
      if (onClose) onClose(false);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la sauvegarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    handleChange,
    handleSubmit
  };
}
