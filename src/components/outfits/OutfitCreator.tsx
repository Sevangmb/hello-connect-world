
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { OutfitCategory, OutfitSeason } from '@/core/outfits/domain/types';
import { useOutfits } from '@/hooks/useOutfits';
import { useToast } from '@/hooks/use-toast';

const OutfitCreator = () => {
  const { toast } = useToast();
  const { createOutfit } = useOutfits();

  const [name, setName] = useState('Nouvelle tenue');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<OutfitCategory>('casual');
  const [season, setSeason] = useState<OutfitSeason>('all');
  const [selectedClothes, setSelectedClothes] = useState<Record<string, string>>({});

  // Récupération des vêtements de l'utilisateur avec React Query
  const { data: userClothes, isLoading, isError } = useQuery({
    queryKey: ['userClothes'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('clothes')
        .select('*')
        .eq('user_id', user.id)
        .eq('archived', false);
        
      if (error) throw error;
      return data || [];
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const outfitData = {
        name,
        description,
        category,
        season,
        top_id: selectedClothes.top,
        bottom_id: selectedClothes.bottom,
        shoes_id: selectedClothes.shoes
      };
      
      await createOutfit(outfitData);
      
      // Reset form
      setName('Nouvelle tenue');
      setDescription('');
      setCategory('casual');
      setSeason('all');
      setSelectedClothes({});
      
    } catch (error) {
      console.error('Error creating outfit:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer la tenue. Veuillez réessayer."
      });
    }
  };

  const handleSelectClothing = (category: string, id: string) => {
    setSelectedClothes(prev => ({
      ...prev,
      [category]: id
    }));
  };

  const renderClothesByCategory = (category: string) => {
    if (isLoading) return <p>Chargement de vos vêtements...</p>;
    if (isError) return <p>Impossible de charger vos vêtements</p>;
    if (!userClothes || userClothes.length === 0) return <p>Vous n'avez pas encore ajouté de vêtements</p>;
    
    const filteredClothes = userClothes.filter(item => 
      item.category.toLowerCase() === category.toLowerCase() ||
      item.subcategory?.toLowerCase() === category.toLowerCase()
    );
    
    if (filteredClothes.length === 0) {
      return <p>Aucun vêtement dans cette catégorie</p>;
    }
    
    return (
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {filteredClothes.map(item => (
          <div 
            key={item.id}
            className={`cursor-pointer border p-2 rounded ${selectedClothes[category] === item.id ? 'border-primary bg-primary/10' : 'border-gray-200'}`}
            onClick={() => handleSelectClothing(category, item.id)}
          >
            {item.image_url ? (
              <img src={item.image_url} alt={item.name} className="h-24 w-full object-cover mb-2" />
            ) : (
              <div className="h-24 w-full bg-gray-200 flex items-center justify-center mb-2">
                <span>Pas d'image</span>
              </div>
            )}
            <p className="text-xs truncate">{item.name}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Créer une nouvelle tenue</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nom de la tenue</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                rows={3} 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Select value={category} onValueChange={(value: OutfitCategory) => setCategory(value)}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casual">Décontracté</SelectItem>
                    <SelectItem value="formal">Habillé</SelectItem>
                    <SelectItem value="sport">Sport</SelectItem>
                    <SelectItem value="beach">Plage</SelectItem>
                    <SelectItem value="winter">Hiver</SelectItem>
                    <SelectItem value="work">Travail</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="season">Saison</Label>
                <Select value={season} onValueChange={(value: OutfitSeason) => setSeason(value)}>
                  <SelectTrigger id="season">
                    <SelectValue placeholder="Sélectionner une saison" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spring">Printemps</SelectItem>
                    <SelectItem value="summer">Été</SelectItem>
                    <SelectItem value="autumn">Automne</SelectItem>
                    <SelectItem value="winter">Hiver</SelectItem>
                    <SelectItem value="all">Toutes saisons</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Sélectionner les vêtements</h3>
              <Tabs defaultValue="top">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="top">Haut</TabsTrigger>
                  <TabsTrigger value="bottom">Bas</TabsTrigger>
                  <TabsTrigger value="shoes">Chaussures</TabsTrigger>
                </TabsList>
                <TabsContent value="top" className="mt-4">
                  {renderClothesByCategory('top')}
                </TabsContent>
                <TabsContent value="bottom" className="mt-4">
                  {renderClothesByCategory('bottom')}
                </TabsContent>
                <TabsContent value="shoes" className="mt-4">
                  {renderClothesByCategory('shoes')}
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          <Button type="submit" className="w-full">Créer la tenue</Button>
        </form>
      </CardContent>
    </Card>
  );
};

// Ajouter le composant Label pour éviter les erreurs
const Label = ({ htmlFor, children, className = "" }: { htmlFor: string; children: React.ReactNode; className?: string }) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium mb-1 ${className}`}>
    {children}
  </label>
);

export default OutfitCreator;
