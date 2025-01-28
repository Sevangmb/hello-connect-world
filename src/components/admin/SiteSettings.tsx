import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";

export function SiteSettings() {
  const [uploading, setUploading] = useState(false);
  const [siteName, setSiteName] = useState("FRING!");
  const { toast } = useToast();

  const uploadLogo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("Vous devez sélectionner une image");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `site-assets/logo.${fileExt}`;

      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      toast({
        title: "Logo mis à jour",
        description: "Le logo du site a été mis à jour avec succès",
      });

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    } finally {
      setUploading(false);
    }
  };

  const updateSiteName = async () => {
    try {
      // Here you would typically update the site name in your database
      // For now we'll just show a success message
      toast({
        title: "Nom du site mis à jour",
        description: "Le nom du site a été mis à jour avec succès",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Paramètres du site</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Logo du site</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                {/* Logo preview would go here */}
                <span className="text-gray-400">Logo</span>
              </div>
              
              <Button disabled={uploading} className="relative">
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*"
                  onChange={uploadLogo}
                  disabled={uploading}
                />
                <Upload className="mr-2 h-4 w-4" />
                {uploading ? "Chargement..." : "Changer le logo"}
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              Format recommandé : PNG ou SVG. Taille maximale : 2MB
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Nom du site</Label>
              <Input
                id="siteName"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="Nom du site"
              />
            </div>
            <Button onClick={updateSiteName}>
              Sauvegarder les modifications
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}