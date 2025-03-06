
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOutfits } from '@/hooks/useOutfits';
import { Outfit, OutfitCategory, OutfitSeason } from '@/core/outfits/domain/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Loader2, Search, PlusCircle, Heart, MessageSquare, 
  Eye, EyeOff, Archive, Edit, Trash2, Filter
} from 'lucide-react';

export const OutfitsList: React.FC = () => {
  const navigate = useNavigate();
  const { outfits, loadUserOutfits, loading, deleteOutfit } = useOutfits();
  const [filteredOutfits, setFilteredOutfits] = useState<Outfit[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [seasonFilter, setSeasonFilter] = useState<string>('');
  const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Catégories disponibles
  const categories = [
    { value: '', label: 'Toutes catégories' },
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
    { value: '', label: 'Toutes saisons' },
    { value: 'spring', label: 'Printemps' },
    { value: 'summer', label: 'Été' },
    { value: 'autumn', label: 'Automne' },
    { value: 'winter', label: 'Hiver' },
    { value: 'all', label: 'Toutes saisons' }
  ];

  useEffect(() => {
    loadUserOutfits();
  }, [loadUserOutfits]);

  // Filtrer les tenues en fonction des critères
  useEffect(() => {
    let filtered = [...outfits];
    
    // Filtre par onglet (statut)
    if (activeTab !== 'all') {
      filtered = filtered.filter(outfit => outfit.status === activeTab);
    }
    
    // Filtre par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(outfit => 
        outfit.name.toLowerCase().includes(query) || 
        (outfit.description && outfit.description.toLowerCase().includes(query))
      );
    }
    
    // Filtre par catégorie
    if (categoryFilter) {
      filtered = filtered.filter(outfit => outfit.category === categoryFilter);
    }
    
    // Filtre par saison
    if (seasonFilter) {
      filtered = filtered.filter(outfit => outfit.season === seasonFilter);
    }
    
    setFilteredOutfits(filtered);
  }, [outfits, activeTab, searchQuery, categoryFilter, seasonFilter]);

  const handleDeleteOutfit = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tenue ?')) {
      setIsDeleting(id);
      try {
        await deleteOutfit(id);
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Publié</Badge>;
      case 'draft':
        return <Badge variant="outline">Brouillon</Badge>;
      case 'private':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Privé</Badge>;
      case 'archived':
        return <Badge variant="secondary">Archivé</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <Eye className="h-4 w-4" />;
      case 'draft':
        return <Edit className="h-4 w-4" />;
      case 'private':
        return <EyeOff className="h-4 w-4" />;
      case 'archived':
        return <Archive className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Mes Tenues</h1>
        <Button 
          onClick={() => navigate('/outfits/create')} 
          className="sm:ml-4"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouvelle tenue
        </Button>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher une tenue..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setIsFilterVisible(!isFilterVisible)}
            className={isFilterVisible ? 'bg-primary/10' : ''}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {isFilterVisible && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={seasonFilter} onValueChange={setSeasonFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Saison" />
              </SelectTrigger>
              <SelectContent>
                {seasons.map(season => (
                  <SelectItem key={season.value} value={season.value}>
                    {season.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="published">Publiées</TabsTrigger>
          <TabsTrigger value="draft">Brouillons</TabsTrigger>
          <TabsTrigger value="private">Privées</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredOutfits.length === 0 ? (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <p className="text-lg text-gray-500 mb-2">Aucune tenue trouvée</p>
              <p className="text-sm text-gray-400 mb-4">
                {searchQuery || categoryFilter || seasonFilter 
                  ? "Essayez de modifier vos filtres"
                  : "Créez votre première tenue dès maintenant"}
              </p>
              <Button 
                onClick={() => navigate('/outfits/create')}
                variant="outline"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Créer une tenue
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOutfits.map((outfit) => (
                <Card key={outfit.id} className="overflow-hidden">
                  <div 
                    className="h-48 bg-gray-100 cursor-pointer"
                    onClick={() => navigate(`/outfits/${outfit.id}`)}
                  >
                    {outfit.image_url ? (
                      <img 
                        src={outfit.image_url} 
                        alt={outfit.name} 
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          {getStatusIcon(outfit.status)}
                          <p className="text-sm text-gray-500 mt-2">{outfit.name}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 
                        className="font-medium cursor-pointer hover:text-primary truncate"
                        onClick={() => navigate(`/outfits/${outfit.id}`)}
                      >
                        {outfit.name}
                      </h3>
                      {getStatusBadge(outfit.status)}
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 h-10">
                      {outfit.description || "Aucune description"}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="outline">{outfit.category}</Badge>
                      <Badge variant="outline">{outfit.season}</Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="px-4 pb-4 pt-0 flex justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Heart className="h-4 w-4 mr-1" />
                        <span>{outfit.likes_count || 0}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        <span>{outfit.comments_count || 0}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => navigate(`/outfits/edit/${outfit.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteOutfit(outfit.id)}
                        disabled={isDeleting === outfit.id}
                      >
                        {isDeleting === outfit.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OutfitsList;
