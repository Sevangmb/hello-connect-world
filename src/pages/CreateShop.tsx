import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Le nom doit faire au moins 2 caractères"),
  description: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url("L'URL doit être valide").optional().or(z.literal("")),
});

export default function CreateShop() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      phone: "",
      website: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour créer une boutique",
          variant: "destructive",
        });
        return;
      }

      // Check if user already has a shop
      const { data: existingShop } = await supabase
        .from("shops")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (existingShop) {
        toast({
          title: "Erreur",
          description: "Vous avez déjà une boutique",
          variant: "destructive",
        });
        navigate("/shops");
        return;
      }

      const { error } = await supabase.from("shops").insert({
        name: values.name,
        description: values.description,
        user_id: user.id,
        address: values.address || null,
        phone: values.phone || null,
        website: values.website || null,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Boutique créée",
        description: "Votre boutique a été créée avec succès et est en attente de validation",
      });
      
      navigate("/shops");
    } catch (error) {
      console.error("Error creating shop:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la boutique",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Ouvrir ma boutique</h1>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de la boutique</FormLabel>
                    <FormControl>
                      <Input placeholder="Ma superbe boutique" {...field} />
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
                      <Textarea 
                        placeholder="Décrivez votre boutique..." 
                        className="resize-none" 
                        {...field} 
                      />
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
                      <Input placeholder="123 rue du Commerce" {...field} />
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
                      <Input placeholder="+33 6 12 34 56 78" {...field} />
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
                      <Input placeholder="https://www.monsite.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/shops")}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Création..." : "Créer ma boutique"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}