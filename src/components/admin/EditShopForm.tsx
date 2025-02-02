<code>
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Le nom doit faire au moins 2 caractères"),
  description: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url("L'URL doit être valide").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

interface EditShopFormProps {
  shop: {
    id: string;
    name: string;
    description?: string;
    address?: string;
    phone?: string;
    website?: string;
  };
  onClose: () => void;
}

export default function EditShopForm({ shop, onClose }: EditShopFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: shop.name || "",
      description: shop.description || "",
      address: shop.address || "",
      phone: shop.phone || "",
      website: shop.website || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("shops")
        .update({
          name: values.name,
          description: values.description || null,
          address: values.address || null,
          phone: values.phone || null,
          website: values.website || null,
        })
        .eq("id", shop.id);

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour la boutique",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Succès",
        description: "La boutique a été mise à jour avec succès",
      });
      onClose();
    } catch (error) {
      console.error("Error updating shop:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Modifier la Boutique</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de la boutique</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom de la boutique" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description de la boutique" className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input placeholder="Adresse de la boutique" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input placeholder="Téléphone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site web</FormLabel>
                  <FormControl>
                    <Input placeholder="Site web de la boutique" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Modification..." : "Enregistrer"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
</code>