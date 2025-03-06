
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useOutfits } from '@/hooks/useOutfits';
import { useClothes } from '@/hooks/useClothes';
import { OutfitCategory, OutfitSeason } from '@/core/outfits/domain/types';
import { Loader2, Trash2, Plus, Save, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

const outfitFormSchema = z.object({
  name: z.string().min(3, { message: 'Le nom doit contenir au moins 3 caractères' }).max(50),
  description: z.string().max(500).optional(),
  category: z.enum(['casual', 'formal', 'sport', 'beach', 'winter', 'work', 'other'] as const),
  season: z.enum(['spring', 'summer', 'autumn', 'winter', 'all'] as const),
  status: z.enum(['draft', 'published', 'private'], { 
    required_error: "Veuillez sélectionner un statut",
  })
});

type OutfitFormValues = z.infer<typeof outfitFormSchema>;

export const OutfitCreator: React.FC = () => {
  const navigate = useNavigate();
  const { createOutfit, loading } = useOutfits();
  const { userClothes, loading: loadingClothes } = useClothes();
  const [selectedClothes, setSelectedClothes] = useState<any[]>([]);

  const form = useForm<OutfitFormValues>({
    resolver: zodResolver(outfitFormSchema),
    defaultValues: {
      name: '',
      description: '',
      category: 'casual',
      season: 'all',
      status: 'draft'
    }
  });

  // Catégories disponibles
  const categories = [
    { value: 'casual', label: 'Casual' },
    { value: 'formal', label: 'Formel' },
    { value: 'sport', label: 'Sport' },
    { value: 'beach', label: 'Plage' },
    { value: 'winter', label: 'Hiver' },
    { value: 'work', label: 'Travail' },
    { value: 'other', label: 'Autre' }
  ];

  // Saisons disponibles
  const seasons = [
    { value: 'spring', label: 'Printemps' },
    { value: 'summer', label: 'Été' },
    { value: 'autumn', label: 'Automne' },
    { value: 'winter', label: 'Hiver' },
    { value: 'all', label: 'Toutes saisons' }
  ];

  // Statuts disponibles
  const statuses = [
    { value: 'draft', label: 'Brouillon' },
    { value: 'published', label: 'Publié' },
    { value: 'private', label: 'Privé' }
  ];

  const onSubmit = async (data: OutfitFormValues) => {
    try {
      if (selectedClothes.length === 0) {
        toast.error('Veuillez sélectionner au moins un vêtement pour votre tenue');
        return;
      }

      // Créer d'abord la tenue
      const newOutfit = await createOutfit({
        name: data.name,
        description: data.description,
        category: data.category as OutfitCategory,
        season: data.season as OutfitSeason,
        status: data.status,
        is_favorite: false,
        likes_count: 0,
        comments_count: 0
      });

      if (!newOutfit) {
        throw new Error('Erreur lors de la création de la tenue');
      }

      // Rediriger vers la page de détail de la tenue créée
      toast.success('Tenue créée avec succès!');
      navigate(`/outfits/${newOutfit.id}`);
    } catch (error) {
      console.error('Error creating outfit:', error);
      toast.error('Erreur lors de la création de la tenue');
    }
  };

  const handleAddClothes = (clothes: any) => {
    // Vérifier si déjà sélectionné
    if (selectedClothes.some(item => item.id === clothes.id)) {
      toast.info('Ce vêtement est déjà dans la tenue');
      return;
    }
    
    setSelectedClothes(prev => [...prev, {
      ...clothes,
      position: prev.length // Position basée sur l'ordre d'ajout
    }]);
  };

  const handleRemoveClothes = (clothesId: string) => {
    setSelectedClothes(prev => prev.filter(item => item.id !== clothesId));
  };

  // Grouper les vêtements par catégorie
  const groupedClothes: Record<string, any[]> = {};
  userClothes.forEach(clothes => {
    const category = clothes.category || 'Autre';
    if (!groupedClothes[category]) {
      groupedClothes[category] = [];
    }
    groupedClothes[category].push(clothes);
  });

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Créer une nouvelle tenue</CardTitle>
              <CardDescription>
                Combinez vos vêtements pour créer une tenue complète
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom de la tenue</FormLabel>
                        <FormControl>
                          <Input placeholder="Été décontracté..." {...field} />
                        </FormControl>
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
                          <Textarea 
                            placeholder="Une description de votre tenue..." 
                            className="min-h-24"
                            {...field} 
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Catégorie</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner une catégorie" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map(category => (
                                <SelectItem key={category.value} value={category.value}>
                                  {category.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="season"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Saison</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner une saison" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {seasons.map(season => (
                                <SelectItem key={season.value} value={season.value}>
                                  {season.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Statut de la tenue</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un statut" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {statuses.map(status => (
                              <SelectItem key={status.value} value={status.value}>
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Les tenues en brouillon ne sont visibles que par vous. Les tenues publiques sont visibles par tous.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-4">
                    <h3 className="text-lg font-medium mb-2">Vêtements sélectionnés</h3>
                    {selectedClothes.length === 0 ? (
                      <div className="text-center py-8 border border-dashed rounded-md">
                        <ImageIcon className="w-12 h-12 mx-auto text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">
                          Aucun vêtement sélectionné
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Choisissez des vêtements dans la liste à droite
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {selectedClothes.map((item) => (
                          <div key={item.id} className="relative border rounded-md p-2 flex flex-col items-center">
                            <Button 
                              type="button"
                              variant="destructive" 
                              size="icon" 
                              className="absolute -top-2 -right-2 h-6 w-6"
                              onClick={() => handleRemoveClothes(item.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                            {item.image_url ? (
                              <img 
                                src={item.image_url} 
                                alt={item.name} 
                                className="h-24 w-auto object-contain mb-2" 
                              />
                            ) : (
                              <div className="h-24 w-24 bg-gray-100 flex items-center justify-center rounded mb-2">
                                <ImageIcon className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                            <p className="text-xs font-medium truncate w-full text-center">{item.name}</p>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {item.category}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-6 flex justify-end space-x-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => navigate(-1)}
                    >
                      Annuler
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Créer la tenue
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Vos vêtements</CardTitle>
              <CardDescription>
                Sélectionnez les vêtements à inclure dans votre tenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingClothes ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : userClothes.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">Vous n'avez pas encore ajouté de vêtements</p>
                  <Button 
                    variant="link" 
                    onClick={() => navigate('/clothes/add')}
                    className="mt-2"
                  >
                    Ajouter des vêtements
                  </Button>
                </div>
              ) : (
                <ScrollArea className="h-[400px] pr-4">
                  {Object.entries(groupedClothes).map(([category, clothes]) => (
                    <div key={category} className="mb-6">
                      <h3 className="font-medium text-sm mb-2">{category}</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {clothes.map((item) => (
                          <div 
                            key={item.id} 
                            className="border rounded-md p-2 hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => handleAddClothes(item)}
                          >
                            <div className="flex flex-col items-center">
                              {item.image_url ? (
                                <img 
                                  src={item.image_url} 
                                  alt={item.name} 
                                  className="h-16 w-auto object-contain mb-2" 
                                />
                              ) : (
                                <div className="h-16 w-16 bg-gray-100 flex items-center justify-center rounded mb-2">
                                  <ImageIcon className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                              <p className="text-xs font-medium truncate w-full text-center">
                                {item.name}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OutfitCreator;
