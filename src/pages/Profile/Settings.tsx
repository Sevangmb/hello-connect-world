
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Bell, Key, Lock, Settings, User, MapPin, Globe, Phone } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as z from "zod";

const profileSchema = z.object({
  full_name: z.string().min(2, "Le nom doit faire au moins 2 caractères"),
  phone: z.string().optional(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    postal_code: z.string(),
    country: z.string(),
    additional_info: z.string().optional()
  }),
  preferred_language: z.string(),
  email_notifications: z.boolean(),
  preferences: z.object({
    theme: z.string(),
    newsletter: z.boolean(),
    order_updates: z.boolean()
  })
});

const Settings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      address: {
        street: "",
        city: "",
        postal_code: "",
        country: "",
        additional_info: ""
      },
      preferred_language: "fr",
      email_notifications: true,
      preferences: {
        theme: "light",
        newsletter: true,
        order_updates: true
      }
    }
  });

  // Récupérer le profil de l'utilisateur
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data) {
        form.reset(data);
      }
    }
  });

  // Mutation pour mettre à jour le profil
  const updateProfile = useMutation({
    mutationFn: async (values: z.infer<typeof profileSchema>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { error } = await supabase
        .from('profiles')
        .update(values)
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour votre profil",
      });
    }
  });

  const handleChangePassword = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) throw new Error("Email non trouvé");
      
      const { error } = await supabase.auth.resetPasswordForEmail(
        user.email,
        { redirectTo: `${window.location.origin}/auth/reset-password` }
      );
      
      if (error) throw error;
      
      toast({
        title: "Email envoyé",
        description: "Consultez votre boîte mail pour changer votre mot de passe",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer l'email de réinitialisation",
      });
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold">Paramètres</h1>
          
          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profil
              </TabsTrigger>
              <TabsTrigger value="address" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Adresse
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Préférences
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Sécurité
              </TabsTrigger>
            </TabsList>

            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => updateProfile.mutate(data))}>
                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informations personnelles</CardTitle>
                      <CardDescription>
                        Gérez vos informations personnelles
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="full_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom complet</FormLabel>
                            <FormControl>
                              <Input {...field} />
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
                              <Input {...field} type="tel" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="address">
                  <Card>
                    <CardHeader>
                      <CardTitle>Adresse</CardTitle>
                      <CardDescription>
                        Gérez votre adresse de livraison
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="address.street"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rue</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ville</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address.postal_code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Code postal</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address.country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pays</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address.additional_info"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Informations complémentaires</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="preferences">
                  <Card>
                    <CardHeader>
                      <CardTitle>Préférences</CardTitle>
                      <CardDescription>
                        Personnalisez votre expérience
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="preferred_language"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Langue préférée</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="preferences.newsletter"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <FormLabel>Newsletter</FormLabel>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="preferences.order_updates"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <FormLabel>Notifications de commandes</FormLabel>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="security">
                  <Card>
                    <CardHeader>
                      <CardTitle>Sécurité</CardTitle>
                      <CardDescription>
                        Gérez vos paramètres de sécurité
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button 
                        type="button"
                        variant="outline" 
                        onClick={handleChangePassword}
                        className="w-full sm:w-auto"
                      >
                        <Key className="w-4 h-4 mr-2" />
                        Changer le mot de passe
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <div className="mt-6">
                  <Button type="submit" disabled={updateProfile.isPending}>
                    {updateProfile.isPending ? "Enregistrement..." : "Enregistrer les modifications"}
                  </Button>
                </div>
              </form>
            </Form>
          </Tabs>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Settings;
