
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scan, Upload, FileText, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ScanLabelFeature = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setScanResult(null);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const scanLabel = async () => {
    if (!selectedImage || !imagePreview) {
      toast({
        title: "Erreur",
        description: "Veuillez d'abord sélectionner une image",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedImage);

      // Upload de l'image vers Supabase Storage
      const fileName = `label-scans/${Date.now()}-${selectedImage.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(fileName, selectedImage);

      if (uploadError) {
        throw new Error(`Erreur lors du téléchargement de l'image: ${uploadError.message}`);
      }

      // Obtenir l'URL publique de l'image
      const { data: urlData } = await supabase.storage
        .from('uploads')
        .getPublicUrl(fileName);

      const imageUrl = urlData?.publicUrl;

      // Appeler la fonction Edge pour l'OCR
      const response = await fetch('https://your-supabase-url.supabase.co/functions/v1/scan-label', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de l'analyse: ${response.statusText}`);
      }

      const data = await response.json();
      setScanResult(data);
      
      toast({
        title: "Analyse réussie",
        description: "Les informations de l'étiquette ont été extraites avec succès",
      });
    } catch (error: any) {
      console.error('Erreur lors de l\'analyse:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de l'analyse",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const saveToWardrobe = async () => {
    if (!scanResult) {
      toast({
        title: "Erreur",
        description: "Aucun résultat d'analyse à enregistrer",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Ici, vous implémenteriez la logique pour enregistrer les données dans la garde-robe
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation d'un délai d'enregistrement
      
      toast({
        title: "Enregistré",
        description: "Le vêtement a été ajouté à votre garde-robe",
      });
      
      // Réinitialiser le formulaire
      setSelectedImage(null);
      setImagePreview(null);
      setScanResult(null);
    } catch (error: any) {
      console.error('Erreur lors de l\'enregistrement:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le vêtement à votre garde-robe",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Scanner une étiquette</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Télécharger une étiquette
            </CardTitle>
            <CardDescription>
              Prenez une photo de l'étiquette de votre vêtement pour en extraire les informations
            </CardDescription>
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
              onClick={handleUploadClick}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            >
              {imagePreview ? (
                <div>
                  <img 
                    src={imagePreview} 
                    alt="Étiquette sélectionnée" 
                    className="mx-auto max-h-48 object-contain mb-2" 
                  />
                  <p className="text-sm text-gray-500">Cliquez pour changer d'image</p>
                </div>
              ) : (
                <div className="py-4">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm font-medium">Cliquez pour sélectionner une image</p>
                  <p className="text-xs text-gray-500">PNG, JPG, JPEG (max 10Mo)</p>
                </div>
              )}
            </div>
            
            <Button 
              className="w-full mt-4"
              onClick={scanLabel}
              disabled={!selectedImage || isScanning}
            >
              {isScanning ? (
                <>
                  <span className="animate-spin mr-2">⚙️</span>
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
            <CardDescription>
              Informations extraites de l'étiquette
            </CardDescription>
          </CardHeader>
          <CardContent>
            {scanResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-y-2">
                  <div className="text-sm font-medium">Marque:</div>
                  <div>{scanResult.brand || "Non détecté"}</div>
                  
                  <div className="text-sm font-medium">Taille:</div>
                  <div>{scanResult.size || "Non détecté"}</div>
                  
                  <div className="text-sm font-medium">Matière:</div>
                  <div>{scanResult.material || "Non détecté"}</div>
                  
                  <div className="text-sm font-medium">Couleur:</div>
                  <div>{scanResult.color || "Non détecté"}</div>
                  
                  <div className="text-sm font-medium">Catégorie:</div>
                  <div>{scanResult.category || "Non détecté"}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-1">Instructions d'entretien:</div>
                  <div className="bg-gray-50 p-2 rounded text-sm">
                    {scanResult.careInstructions || "Non détecté"}
                  </div>
                </div>
                
                <Button 
                  onClick={saveToWardrobe} 
                  className="w-full"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <span className="animate-spin mr-2">⚙️</span>
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Ajouter à ma garde-robe
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500">
                <FileText className="h-16 w-16 text-gray-300 mb-4" />
                <p>Téléchargez une image et lancez l'analyse pour voir les résultats</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScanLabelFeature;
