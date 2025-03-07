
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, User, Shirt, Camera, Image, Check } from 'lucide-react';

const VirtualTryOnFeature = () => {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedClothing, setSelectedClothing] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId);
    setGeneratedImage(null);
  };

  const handleClothingSelect = (clothingId: string) => {
    setSelectedClothing(clothingId);
    setGeneratedImage(null);
  };

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const generateTryOn = () => {
    if (!selectedModel || !selectedClothing) return;
    
    setIsGenerating(true);
    
    // Simuler le temps de génération
    setTimeout(() => {
      setGeneratedImage('/placeholder.svg');
      setIsGenerating(false);
    }, 2000);
  };

  // Données simulées pour les modèles et vêtements
  const models = [
    { id: 'model1', name: 'Modèle 1', image: '/placeholder.svg' },
    { id: 'model2', name: 'Modèle 2', image: '/placeholder.svg' },
    { id: 'model3', name: 'Modèle personnalisé', image: '/placeholder.svg' },
  ];

  const clothingItems = [
    { id: 'clothing1', name: 'T-shirt blanc', type: 'Haut', image: '/placeholder.svg' },
    { id: 'clothing2', name: 'Chemise bleue', type: 'Haut', image: '/placeholder.svg' },
    { id: 'clothing3', name: 'Pull noir', type: 'Haut', image: '/placeholder.svg' },
    { id: 'clothing4', name: 'Jean bleu', type: 'Bas', image: '/placeholder.svg' },
    { id: 'clothing5', name: 'Pantalon noir', type: 'Bas', image: '/placeholder.svg' },
    { id: 'clothing6', name: 'Jupe plissée', type: 'Bas', image: '/placeholder.svg' },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Essayage Virtuel</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Résultat de l'essayage</CardTitle>
              <CardDescription>Visualisez le vêtement sur votre modèle</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[400px]">
              {isGenerating ? (
                <div className="text-center">
                  <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p>Génération en cours...</p>
                </div>
              ) : generatedImage ? (
                <img 
                  src={generatedImage} 
                  alt="Essayage virtuel" 
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="text-center text-gray-500">
                  <Shirt className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p>Sélectionnez un modèle et un vêtement pour générer une visualisation</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Tabs defaultValue="model">
            <TabsList className="w-full">
              <TabsTrigger value="model" className="flex-1">
                <User className="h-4 w-4 mr-2" />
                Modèle
              </TabsTrigger>
              <TabsTrigger value="clothing" className="flex-1">
                <Shirt className="h-4 w-4 mr-2" />
                Vêtement
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="model">
              <Card>
                <CardHeader>
                  <CardTitle>Choisir un modèle</CardTitle>
                  <CardDescription>Sélectionnez un modèle ou téléchargez votre photo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
                      onClick={handleFileUpload}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className="hidden"
                      />
                      <Camera className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm font-medium">Télécharger ma photo</p>
                      <p className="text-xs text-gray-500">PNG, JPG, JPEG (max 10Mo)</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {models.map(model => (
                        <div
                          key={model.id}
                          className={`border rounded-lg overflow-hidden cursor-pointer ${
                            selectedModel === model.id ? 'border-primary ring-2 ring-primary/20' : ''
                          }`}
                          onClick={() => handleModelSelect(model.id)}
                        >
                          <div className="relative">
                            <img src={model.image} alt={model.name} className="w-full h-32 object-cover" />
                            {selectedModel === model.id && (
                              <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                                <Check className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                          <div className="p-2 text-center">
                            <p className="text-sm font-medium truncate">{model.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="clothing">
              <Card>
                <CardHeader>
                  <CardTitle>Choisir un vêtement</CardTitle>
                  <CardDescription>Sélectionnez un vêtement à essayer</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {clothingItems.map(item => (
                      <div
                        key={item.id}
                        className={`border rounded-lg overflow-hidden cursor-pointer ${
                          selectedClothing === item.id ? 'border-primary ring-2 ring-primary/20' : ''
                        }`}
                        onClick={() => handleClothingSelect(item.id)}
                      >
                        <div className="relative">
                          <img src={item.image} alt={item.name} className="w-full h-24 object-contain p-2" />
                          {selectedClothing === item.id && (
                            <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                              <Check className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <div className="p-2 text-center bg-gray-50">
                          <p className="text-xs text-gray-500">{item.type}</p>
                          <p className="text-sm font-medium truncate">{item.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <Button 
            className="w-full mt-4"
            onClick={generateTryOn}
            disabled={!selectedModel || !selectedClothing || isGenerating}
          >
            {isGenerating ? 'Génération...' : 'Essayer virtuellement'}
          </Button>
          
          {generatedImage && (
            <div className="mt-4 flex space-x-2">
              <Button variant="outline" className="flex-1">
                <Image className="h-4 w-4 mr-2" />
                Enregistrer
              </Button>
              <Button variant="outline" className="flex-1">
                <Upload className="h-4 w-4 mr-2" />
                Partager
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VirtualTryOnFeature;
