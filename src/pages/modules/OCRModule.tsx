
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Scan, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const OCRModule = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setImage(selectedFile);
      setImageUrl(URL.createObjectURL(selectedFile));
      setScanResult(null);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const scanLabel = async () => {
    if (!image || !imageUrl) {
      toast({
        title: "Erreur",
        description: "Veuillez d'abord sélectionner une image",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    try {
      // Créer un objet FormData pour l'upload
      const formData = new FormData();
      formData.append('file', image);

      // Simuler l'upload vers Supabase Storage
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fakeImageUrl = `https://example.com/storage/uploads/${timestamp}_${randomString}_${image.name}`;

      // Appeler la fonction Supabase Edge pour l'OCR
      const response = await fetch('https://your-supabase-project.functions.supabase.co/scan-label', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: fakeImageUrl }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'analyse de l\'image');
      }

      // Simuler une réponse pour démonstration
      const demoResult = {
        brand: "ExampleBrand",
        size: "L",
        material: "100% Cotton",
        careInstructions: "Machine wash cold, tumble dry low",
        color: "Blue",
        category: "Hauts"
      };

      setScanResult(demoResult);
      toast({
        title: "Analyse réussie",
        description: "Les informations de l'étiquette ont été extraites",
      });
    } catch (error) {
      console.error("Erreur d'OCR:", error);
      toast({
        title: "Erreur d'analyse",
        description: "Impossible d'analyser l'image. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Module OCR - Analyse d'étiquettes</h1>

      <Tabs defaultValue="scan">
        <TabsList className="mb-6 w-full">
          <TabsTrigger value="scan" className="flex-1">Scanner une étiquette</TabsTrigger>
          <TabsTrigger value="history" className="flex-1">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="scan">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Télécharger une image
                </CardTitle>
                <CardDescription>Sélectionnez une photo d'étiquette de vêtement</CardDescription>
              </CardHeader>
              <CardContent>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                />

                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50"
                  onClick={handleUploadClick}
                >
                  {imageUrl ? (
                    <div className="relative">
                      <img 
                        src={imageUrl} 
                        alt="Étiquette" 
                        className="mx-auto max-h-[200px] object-contain"
                      />
                      <p className="mt-2 text-sm text-gray-500">Cliquez pour changer d'image</p>
                    </div>
                  ) : (
                    <div className="py-4">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm font-medium text-gray-900">Cliquez pour sélectionner une image</p>
                      <p className="text-xs text-gray-500">PNG, JPG, JPEG jusqu'à 10MB</p>
                    </div>
                  )}
                </div>

                <Button 
                  className="w-full mt-4" 
                  onClick={scanLabel} 
                  disabled={!image || isScanning}
                >
                  {isScanning ? (
                    <>
                      <span className="animate-spin mr-2">◌</span>
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <Scan className="h-4 w-4 mr-2" />
                      Analyser l'étiquette
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Résultats de l'analyse
                </CardTitle>
                <CardDescription>Informations extraites de l'étiquette</CardDescription>
              </CardHeader>
              <CardContent>
                {scanResult ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm font-medium">Marque:</div>
                      <div className="text-sm">{scanResult.brand || "Non détecté"}</div>
                      
                      <div className="text-sm font-medium">Taille:</div>
                      <div className="text-sm">{scanResult.size || "Non détecté"}</div>
                      
                      <div className="text-sm font-medium">Matière:</div>
                      <div className="text-sm">{scanResult.material || "Non détecté"}</div>
                      
                      <div className="text-sm font-medium">Couleur:</div>
                      <div className="text-sm">{scanResult.color || "Non détecté"}</div>
                      
                      <div className="text-sm font-medium">Catégorie:</div>
                      <div className="text-sm">{scanResult.category || "Non détecté"}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-1">Instructions d'entretien:</div>
                      <div className="text-sm p-2 bg-gray-50 rounded">
                        {scanResult.careInstructions || "Non détecté"}
                      </div>
                    </div>
                    
                    <Button className="w-full">
                      Ajouter à ma garde-robe
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-2">Téléchargez une image et lancez l'analyse pour voir les résultats</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Historique des analyses</CardTitle>
              <CardDescription>Liste des étiquettes analysées précédemment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p>Aucun historique disponible</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OCRModule;
