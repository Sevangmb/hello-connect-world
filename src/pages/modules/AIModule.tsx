
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ModuleGuard } from '@/components/modules/ModuleGuard';
import { Button } from '@/components/ui/button';
import { Sparkles, Shirt, Palette, Blocks } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AIModule = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerate = () => {
    setIsGenerating(true);
    // Simuler un délai de génération
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };
  
  return (
    <ModuleGuard moduleCode="ai">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Module IA</h1>
        
        <Tabs defaultValue="suggestions">
          <TabsList className="mb-6 w-full">
            <TabsTrigger value="suggestions" className="flex-1">
              <Sparkles className="h-4 w-4 mr-2" />
              Suggestions
            </TabsTrigger>
            <TabsTrigger value="generation" className="flex-1">
              <Palette className="h-4 w-4 mr-2" />
              Génération
            </TabsTrigger>
            <TabsTrigger value="virtual-try" className="flex-1">
              <Shirt className="h-4 w-4 mr-2" />
              Essayage Virtuel
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="suggestions">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Suggestions de tenues
                  </CardTitle>
                  <CardDescription>Recevez des suggestions de tenues personnalisées</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">Notre IA analyse votre garde-robe et vous propose des tenues adaptées à vos goûts et aux occasions.</p>
                  <div className="flex justify-between mt-4">
                    <Button variant="outline">Occasion</Button>
                    <Button variant="outline">Style</Button>
                    <Button>Suggérer</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Blocks className="h-5 w-5 mr-2" />
                    Compléter ma garde-robe
                  </CardTitle>
                  <CardDescription>Suggestions d'articles pour compléter votre garde-robe</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">Découvrez les pièces qui manquent à votre garde-robe pour créer plus de tenues.</p>
                  <Button className="w-full">Analyser ma garde-robe</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="generation">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="h-5 w-5 mr-2" />
                  Génération d'images
                </CardTitle>
                <CardDescription>Créez des images de vêtements avec l'IA</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea 
                      className="w-full rounded-md border border-gray-300 p-2" 
                      rows={3}
                      placeholder="Décrivez le vêtement que vous souhaitez générer..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Style</label>
                      <select className="w-full rounded-md border border-gray-300 p-2">
                        <option>Décontracté</option>
                        <option>Formel</option>
                        <option>Sportif</option>
                        <option>Vintage</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Couleur dominante</label>
                      <select className="w-full rounded-md border border-gray-300 p-2">
                        <option>Noir</option>
                        <option>Blanc</option>
                        <option>Bleu</option>
                        <option>Rouge</option>
                        <option>Vert</option>
                      </select>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                  >
                    {isGenerating ? 'Génération en cours...' : 'Générer une image'}
                  </Button>
                  
                  <div className="border rounded-md p-4 text-center">
                    <p className="text-gray-500">L'image générée apparaîtra ici</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="virtual-try">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shirt className="h-5 w-5 mr-2" />
                  Essayage Virtuel
                </CardTitle>
                <CardDescription>Essayez virtuellement des vêtements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Votre avatar</h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg h-60 flex items-center justify-center">
                      <p className="text-gray-500">Téléchargez une photo ou utilisez votre avatar</p>
                    </div>
                    <Button className="w-full mt-2">Télécharger une photo</Button>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Vêtements à essayer</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 border rounded-md">
                        <span>T-shirt blanc</span>
                        <Button variant="ghost" size="sm">Sélectionner</Button>
                      </div>
                      <div className="flex justify-between items-center p-2 border rounded-md">
                        <span>Jean bleu</span>
                        <Button variant="ghost" size="sm">Sélectionner</Button>
                      </div>
                      <div className="flex justify-between items-center p-2 border rounded-md">
                        <span>Veste noire</span>
                        <Button variant="ghost" size="sm">Sélectionner</Button>
                      </div>
                    </div>
                    <Button className="w-full mt-4">Essayer</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ModuleGuard>
  );
};

export default AIModule;
