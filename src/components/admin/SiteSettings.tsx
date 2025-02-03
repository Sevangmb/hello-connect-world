import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Palette,
  Upload,
  MessageSquare,
  ListTree,
  Share2,
} from "lucide-react";

export function SiteSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch site settings
  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*");
      
      if (error) throw error;
      
      // Convert array of settings to object
      const settingsObj: { [key: string]: any } = {};
      data.forEach((setting) => {
        settingsObj[setting.key] = setting.value;
      });
      
      return settingsObj;
    },
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ["site-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_categories")
        .select("*")
        .order("type")
        .order("order_index");
      
      if (error) throw error;
      return data;
    },
  });

  const handleSave = async (key: string, value: any) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("site_settings")
        .upsert({ key, value, updated_by: (await supabase.auth.getUser()).data.user?.id })
        .eq("key", key);

      if (error) throw error;

      toast({
        title: "Paramètres mis à jour",
        description: "Les modifications ont été enregistrées avec succès.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres du site</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="theme" className="space-y-4">
            <TabsList>
              <TabsTrigger value="theme" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Thème
              </TabsTrigger>
              <TabsTrigger value="logo" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Logo
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Messages
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex items-center gap-2">
                <ListTree className="h-4 w-4" />
                Catégories
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Réseaux sociaux
              </TabsTrigger>
            </TabsList>

            <TabsContent value="theme" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="primary">Couleur primaire</Label>
                  <Input
                    id="primary"
                    type="color"
                    value={settings?.theme?.primary || "#69d2e7"}
                    onChange={(e) =>
                      handleSave("theme", {
                        ...settings?.theme,
                        primary: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="secondary">Couleur secondaire</Label>
                  <Input
                    id="secondary"
                    type="color"
                    value={settings?.theme?.secondary || "#a7dbd8"}
                    onChange={(e) =>
                      handleSave("theme", {
                        ...settings?.theme,
                        secondary: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="accent">Couleur d'accent</Label>
                  <Input
                    id="accent"
                    type="color"
                    value={settings?.theme?.accent || "#f38630"}
                    onChange={(e) =>
                      handleSave("theme", {
                        ...settings?.theme,
                        accent: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="background">Couleur de fond</Label>
                  <Input
                    id="background"
                    type="color"
                    value={settings?.theme?.background || "#ffffff"}
                    onChange={(e) =>
                      handleSave("theme", {
                        ...settings?.theme,
                        background: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="text">Couleur du texte</Label>
                  <Input
                    id="text"
                    type="color"
                    value={settings?.theme?.text || "#333333"}
                    onChange={(e) =>
                      handleSave("theme", {
                        ...settings?.theme,
                        text: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="logo" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="logo-url">URL du logo</Label>
                  <Input
                    id="logo-url"
                    type="url"
                    placeholder="https://example.com/logo.png"
                    value={settings?.logo?.url || ""}
                    onChange={(e) =>
                      handleSave("logo", {
                        ...settings?.logo,
                        url: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="logo-alt">Texte alternatif</Label>
                  <Input
                    id="logo-alt"
                    type="text"
                    placeholder="Description du logo"
                    value={settings?.logo?.alt || ""}
                    onChange={(e) =>
                      handleSave("logo", {
                        ...settings?.logo,
                        alt: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="messages" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="welcome-header">Message principal</Label>
                  <Input
                    id="welcome-header"
                    type="text"
                    placeholder="Bienvenue sur notre plateforme"
                    value={settings?.welcome_messages?.header || ""}
                    onChange={(e) =>
                      handleSave("welcome_messages", {
                        ...settings?.welcome_messages,
                        header: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="welcome-subheader">Message secondaire</Label>
                  <Input
                    id="welcome-subheader"
                    type="text"
                    placeholder="Découvrez la mode autrement"
                    value={settings?.welcome_messages?.subheader || ""}
                    onChange={(e) =>
                      handleSave("welcome_messages", {
                        ...settings?.welcome_messages,
                        subheader: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="categories" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Icône</TableHead>
                    <TableHead>Ordre</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories?.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>{category.type}</TableCell>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>{category.description}</TableCell>
                      <TableCell>{category.icon}</TableCell>
                      <TableCell>{category.order_index}</TableCell>
                      <TableCell>
                        {category.is_active ? "Actif" : "Inactif"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button variant="outline">Ajouter une catégorie</Button>
            </TabsContent>

            <TabsContent value="social" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    type="url"
                    placeholder="https://facebook.com/..."
                    value={settings?.social_links?.facebook || ""}
                    onChange={(e) =>
                      handleSave("social_links", {
                        ...settings?.social_links,
                        facebook: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    type="url"
                    placeholder="https://twitter.com/..."
                    value={settings?.social_links?.twitter || ""}
                    onChange={(e) =>
                      handleSave("social_links", {
                        ...settings?.social_links,
                        twitter: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    type="url"
                    placeholder="https://instagram.com/..."
                    value={settings?.social_links?.instagram || ""}
                    onChange={(e) =>
                      handleSave("social_links", {
                        ...settings?.social_links,
                        instagram: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}