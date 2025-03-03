
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Grid, List, MapPin, Plus, Search, ShoppingBag, SlidersHorizontal, Store } from "lucide-react";
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { ShopCard } from "@/components/shop/ShopCard";
import { StoreFilters } from "@/components/stores/StoreFilters";
import StoreMap from "@/components/stores/StoreMap";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStores } from "@/hooks/useStores";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

export default function Boutiques() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list" | "calendar">("grid");
  const [categories, setCategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  const {
    stores,
    loading,
    filters,
    setFilters,
  } = useStores();

  // Fetch shop categories from the database
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const { data, error } = await supabase
          .from('site_categories')
          .select('name')
          .eq('type', 'shop_category')
          .eq('is_active', true)
          .order('order_index');
          
        if (error) throw error;
        
        setCategories(data.map(cat => cat.name));
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };
    
    fetchCategories();
  }, []);

  // Filter stores based on search query
  const filteredStores = searchQuery
    ? stores.filter(store => 
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : stores;

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Store className="h-6 w-6 text-purple-600" />
                  Boutiques
                </h1>
                <p className="text-muted-foreground mt-1">
                  Découvrez les boutiques de vide-dressing près de chez vous
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="secondary" 
                  onClick={() => navigate("/favorites")}
                  className="hidden md:flex"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Mes favoris
                </Button>
                <Button onClick={() => navigate("/shops/create")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ouvrir ma boutique
                </Button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Rechercher une boutique..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:w-auto">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filtres
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filtres</SheetTitle>
                    <SheetDescription>
                      Affinez votre recherche de boutiques
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="py-6 space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Catégorie</h3>
                      <Select 
                        value={filters.category} 
                        onValueChange={(value) => setFilters({...filters, category: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Toutes les catégories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes les catégories</SelectItem>
                          {loadingCategories ? (
                            <SelectItem value="loading" disabled>Chargement...</SelectItem>
                          ) : (
                            categories.map((category) => (
                              <SelectItem key={category} value={category.toLowerCase()}>
                                {category}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Gamme de prix</h3>
                      <Select 
                        value={filters.priceRange} 
                        onValueChange={(value) => setFilters({...filters, priceRange: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tous les prix" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les prix</SelectItem>
                          <SelectItem value="budget">Budget (€)</SelectItem>
                          <SelectItem value="mid">Milieu de gamme (€€)</SelectItem>
                          <SelectItem value="premium">Premium (€€€)</SelectItem>
                          <SelectItem value="luxury">Luxe (€€€€)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Style</h3>
                      <Select 
                        value={filters.style} 
                        onValueChange={(value) => setFilters({...filters, style: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tous les styles" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les styles</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="chic">Chic</SelectItem>
                          <SelectItem value="streetwear">Streetwear</SelectItem>
                          <SelectItem value="vintage">Vintage</SelectItem>
                          <SelectItem value="boheme">Bohème</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <SheetFooter>
                    <SheetClose asChild>
                      <Button 
                        onClick={() => {
                          setFilters({
                            category: "all",
                            priceRange: "all",
                            style: "all"
                          });
                          toast({
                            title: "Filtres réinitialisés",
                            description: "Tous les filtres ont été réinitialisés"
                          });
                        }}
                        variant="outline"
                      >
                        Réinitialiser
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button>Appliquer</Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
              
              <div className="flex">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="rounded-none border-l-0 border-r-0"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "calendar" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("calendar")}
                  className="rounded-l-none"
                >
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Active filters display */}
            <div className="mb-6 flex flex-wrap gap-2">
              {filters.category !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Catégorie: {filters.category}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => setFilters({...filters, category: "all"})}
                  />
                </Badge>
              )}
              {filters.priceRange !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Prix: {filters.priceRange}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => setFilters({...filters, priceRange: "all"})}
                  />
                </Badge>
              )}
              {filters.style !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Style: {filters.style}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => setFilters({...filters, style: "all"})}
                  />
                </Badge>
              )}
            </div>

            {/* Display modes */}
            {viewMode === "grid" && (
              <div>
                {loading ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {Array(6).fill(0).map((_, i) => (
                      <Card key={i} className="overflow-hidden">
                        <Skeleton className="h-48 w-full" />
                        <CardContent className="p-4">
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-2/3" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : filteredStores.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredStores.map((store) => (
                      <ShopCard key={store.id} shop={store} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border rounded-lg">
                    <Store className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucune boutique trouvée</h3>
                    <p className="text-muted-foreground mb-4">
                      Essayez de modifier vos filtres ou votre recherche
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setFilters({
                          category: "all",
                          priceRange: "all",
                          style: "all"
                        });
                        setSearchQuery("");
                      }}
                    >
                      Réinitialiser les filtres
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            {viewMode === "list" && (
              <div className="space-y-4">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <div key={i} className="flex gap-4 p-4 border rounded-lg">
                      <Skeleton className="h-24 w-24 rounded-md" />
                      <div className="flex-1">
                        <Skeleton className="h-6 w-1/2 mb-2" />
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/3" />
                      </div>
                    </div>
                  ))
                ) : filteredStores.length > 0 ? (
                  filteredStores.map((store) => (
                    <div 
                      key={store.id} 
                      className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => navigate(`/shops/${store.id}`)}
                    >
                      <div className="sm:w-36 h-36 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Store className="h-12 w-12 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium">{store.name}</h3>
                        <p className="text-muted-foreground line-clamp-2 mb-2">{store.description}</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {store.categories?.map((category, i) => (
                            <Badge key={i} variant="outline">
                              {category}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{store.address || "Adresse non renseignée"}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 border rounded-lg">
                    <Store className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucune boutique trouvée</h3>
                    <p className="text-muted-foreground mb-4">
                      Essayez de modifier vos filtres ou votre recherche
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setFilters({
                          category: "all",
                          priceRange: "all",
                          style: "all"
                        });
                        setSearchQuery("");
                      }}
                    >
                      Réinitialiser les filtres
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            {viewMode === "calendar" && (
              <div className="h-[600px] border rounded-lg overflow-hidden">
                <StoreMap stores={filteredStores} isLoading={loading} />
              </div>
            )}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
