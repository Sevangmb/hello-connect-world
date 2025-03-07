
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Cloud, Calendar, Shirt } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

const OutfitSuggestionFeature = () => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[] | null>(null);
  
  // Simulation des données météo
  const weatherData = {
    temperature: 22,
    condition: 'Ensoleillé',
    icon: '☀️',
  };

  const generateSuggestions = (mode: string) => {
    setLoading(true);
    setSuggestions(null);
    
    // Simuler un délai de chargement
    setTimeout(() => {
      // Données de suggestions simulées
      const mockSuggestions = [
        {
          id: 1,
          name: "Tenue décontractée",
          items: [
            { type: "Haut", name: "T-shirt blanc", image: "/placeholder.svg" },
            { type: "Bas", name: "Jean bleu", image: "/placeholder.svg" },
            { type: "Chaussures", name: "Baskets blanches", image: "/placeholder.svg" },
          ]
        },
        {
          id: 2,
          name: "Tenue élégante",
          items: [
            { type: "Haut", name: "Chemise bleue ciel", image: "/placeholder.svg" },
            { type: "Bas", name: "Pantalon chino beige", image: "/placeholder.svg" },
            { type: "Chaussures", name: "Mocassins bruns", image: "/placeholder.svg" },
          ]
        }
      ];
      
      setSuggestions(mockSuggestions);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Suggestions de tenues</h1>
      
      <Tabs defaultValue="weather">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="weather" className="flex-1">
            <Cloud className="h-4 w-4 mr-2" />
            Selon la météo
          </TabsTrigger>
          <TabsTrigger value="event" className="flex-1">
            <Calendar className="h-4 w-4 mr-2" />
            Pour un événement
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex-1">
            <Sparkles className="h-4 w-4 mr-2" />
            IA créative
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="weather">
          <Card>
            <CardHeader>
              <CardTitle>Tenues adaptées à la météo</CardTitle>
              <CardDescription>
                Suggestions basées sur la météo actuelle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 bg-blue-50 p-4 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Météo actuelle</h3>
                    <p className="text-sm text-gray-600">Paris, France</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-3xl mr-2">{weatherData.icon}</span>
                    <div>
                      <p className="font-medium">{weatherData.temperature}°C</p>
                      <p className="text-sm">{weatherData.condition}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => generateSuggestions('weather')} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Génération en cours...' : 'Générer des suggestions'}
              </Button>
              
              {loading && (
                <div className="mt-6 space-y-4">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-48 w-full" />
                </div>
              )}
              
              {suggestions && (
                <div className="mt-6 space-y-6">
                  {suggestions.map(suggestion => (
                    <div key={suggestion.id} className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 p-3 border-b">
                        <h3 className="font-medium">{suggestion.name}</h3>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-3 gap-4">
                          {suggestion.items.map((item: any, index: number) => (
                            <div key={index} className="text-center">
                              <div className="bg-gray-100 rounded-md p-2 mb-2">
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="h-24 w-full object-contain mx-auto"
                                />
                              </div>
                              <p className="text-xs font-medium">{item.type}</p>
                              <p className="text-xs text-gray-600">{item.name}</p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button variant="outline" size="sm">Enregistrer</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="event">
          <Card>
            <CardHeader>
              <CardTitle>Tenues pour un événement</CardTitle>
              <CardDescription>
                Suggestions basées sur le type d'événement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Type d'événement</label>
                <select className="w-full border border-gray-300 rounded-md p-2">
                  <option value="casual">Sortie décontractée</option>
                  <option value="formal">Événement formel</option>
                  <option value="work">Journée de travail</option>
                  <option value="party">Soirée festive</option>
                  <option value="sport">Activité sportive</option>
                </select>
              </div>
              
              <Button 
                onClick={() => generateSuggestions('event')} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Génération en cours...' : 'Générer des suggestions'}
              </Button>
              
              {loading && (
                <div className="mt-6 space-y-4">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-48 w-full" />
                </div>
              )}
              
              {suggestions && (
                <div className="mt-6 space-y-6">
                  {suggestions.map(suggestion => (
                    <div key={suggestion.id} className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 p-3 border-b">
                        <h3 className="font-medium">{suggestion.name}</h3>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-3 gap-4">
                          {suggestion.items.map((item: any, index: number) => (
                            <div key={index} className="text-center">
                              <div className="bg-gray-100 rounded-md p-2 mb-2">
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="h-24 w-full object-contain mx-auto"
                                />
                              </div>
                              <p className="text-xs font-medium">{item.type}</p>
                              <p className="text-xs text-gray-600">{item.name}</p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button variant="outline" size="sm">Enregistrer</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle>Suggestions IA créatives</CardTitle>
              <CardDescription>
                Laissez notre IA vous inspirer avec des tenues créatives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Inspiration ou style</label>
                <input 
                  type="text" 
                  placeholder="Ex: style parisien, look années 90, couleurs automnales..." 
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              
              <Button 
                onClick={() => generateSuggestions('ai')} 
                disabled={loading}
                className="w-full"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {loading ? 'L\'IA réfléchit...' : 'Demander à l\'IA'}
              </Button>
              
              {loading && (
                <div className="mt-6 space-y-4">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-48 w-full" />
                </div>
              )}
              
              {suggestions && (
                <div className="mt-6 space-y-6">
                  {suggestions.map(suggestion => (
                    <div key={suggestion.id} className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 p-3 border-b">
                        <h3 className="font-medium">{suggestion.name}</h3>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-3 gap-4">
                          {suggestion.items.map((item: any, index: number) => (
                            <div key={index} className="text-center">
                              <div className="bg-gray-100 rounded-md p-2 mb-2">
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="h-24 w-full object-contain mx-auto"
                                />
                              </div>
                              <p className="text-xs font-medium">{item.type}</p>
                              <p className="text-xs text-gray-600">{item.name}</p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button variant="outline" size="sm">Enregistrer</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OutfitSuggestionFeature;
