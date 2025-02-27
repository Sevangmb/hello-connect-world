
import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Category {
  id: string;
  type: string;
  name: string;
  description: string;
  icon: string;
  order_index: number;
  is_active: boolean;
}

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category;
  onSave: () => void;
}

export function CategoryDialog({ 
  open, 
  onOpenChange, 
  category, 
  onSave 
}: CategoryDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Category>>({
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
  }, [category, open]);

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
            updated_at: new Date().toISOString() // Convertir en string ISO
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

      onSave();
      onOpenChange(false);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {category ? "Modifier la catégorie" : "Ajouter une catégorie"}
          </DialogTitle>
        </DialogHeader>
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
              value={formData.description}
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
              value={formData.icon}
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
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="mr-2 h-4 w-4" />
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            <Check className="mr-2 h-4 w-4" />
            {category ? "Mettre à jour" : "Ajouter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
