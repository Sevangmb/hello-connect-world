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
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Le nom doit faire au moins 2 caractères"),
  description: z.string().optional(),
  address: z.string().min(2, "L'adresse est requise"),
  phone: z.string().min(10, "Le numéro de téléphone doit faire au moins 10 caractères"),
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
    if (loading) return;
    
    try {
      setLoading(true);
      console.log("Creating shop with values:", values);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour créer une boutique",
          variant: "destructive",
        });
        return;
      }

      // Vérifier si l'utilisateur a déjà une boutique
      const { data: existingShops } = await supabase
        .from("shops")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (existingShops) {
        toast({
          title: "Erreur",
          description: "Vous avez déjà une boutique. Vous ne pouvez pas en créer une deuxième.",
          variant: "destructive",
        });
        navigate("/shops");
        return;
      }

      const { error } = await supabase.from("shops").insert({
        name: values.name,
        description: values.description,
        user_id: user.id,
        address: values.address,
        phone: values.phone,
        website: values.website || null,
        status: "pending",
      });

      if (error) {
        console.error("Error creating shop:", error);
        throw error;
      }

      toast({
        title: "Boutique créée",
        description: "Votre boutique a été créée avec succès et est en attente de validation",
      });
      
      navigate("/shops");
    } catch (error: any) {
      console.error("Error creating shop:", error);
      toast({
        title: "Erreur",
        description: error.message === "duplicate key value violates unique constraint \"shops_user_id_key\"" 
          ? "Vous avez déjà une boutique. Vous ne pouvez pas en créer une deuxième."
          : "Une erreur est survenue lors de la création de la boutique",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MainSidebar />
      
      <main className="container mx-auto px-4 pt-24 pb-16 md:pl-72 md:pb-0">
        <div className="max-w-2xl mx-auto bg-card p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-6">Ouvrir ma boutique</h1>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de la boutique *</FormLabel>
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
                    <FormLabel>Adresse *</FormLabel>
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
                    <FormLabel>Téléphone *</FormLabel>
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

              <div className="flex justify-end gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/shops")}
                  disabled={loading}
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="min-w-[100px]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Création...
                    </>
                  ) : (
                    "Créer ma boutique"
                  )}
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