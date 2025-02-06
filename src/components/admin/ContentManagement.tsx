import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const contentSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  content: z.string().min(1, "Le contenu est requis"),
});

type ContentFormValues = z.infer<typeof contentSchema>;

export function ContentManagement() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
    },
  });

  console.log("Rendering ContentManagement component");

  const onSubmit = async (data: ContentFormValues) => {
    try {
      setIsLoading(true);
      console.log("Submitting content:", data);
      
      const { error } = await supabase
        .from('site_content')
        .insert([
          {
            title: data.title,
            description: data.description,
            content: data.content,
          },
        ]);

      if (error) {
        console.error("Error inserting content:", error);
        throw error;
      }

      console.log("Content added successfully");
      toast({
        title: "Contenu ajouté",
        description: "Le contenu a été ajouté avec succès",
      });
      
      form.reset();
    } catch (error) {
      console.error("Error saving content:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du contenu",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion du Contenu</CardTitle>
          <CardDescription>
            Gérez le contenu de votre site web ici. Vous pouvez ajouter, modifier
            et supprimer du contenu.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre</FormLabel>
                    <FormControl>
                      <Input placeholder="Titre du contenu" {...field} />
                    </FormControl>
                    <FormDescription>
                      Le titre qui sera affiché en haut de la page
                    </FormDescription>
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
                      <Input
                        placeholder="Brève description du contenu"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Une courte description qui apparaîtra sous le titre
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contenu</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Contenu principal"
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Le contenu principal de la page
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Enregistrement..." : "Enregistrer le contenu"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
