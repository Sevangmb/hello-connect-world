import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shirt, PenSquare, Footprints } from "lucide-react";
import { OutfitInteractions } from "@/components/outfits/OutfitInteractions";

const TrendingOutfits = () => {
  const { data: trendingOutfits, isLoading } = useQuery({
    queryKey: ["trending-outfits"],
    queryFn: async () => {
      console.log("Fetching trending outfits...");
      
      // Première requête pour obtenir le nombre de likes par tenue avec GROUP BY
      const { data: likesCount, error: likesError } = await supabase
        .from('outfit_likes')
        .select('outfit_id, count(*)', { count: 'exact', head: false })
        .groupBy('outfit_id')
        .order('count', { ascending: false })
        .limit(20);

      if (likesError) {
        console.error("Error fetching likes count:", likesError);
        throw likesError;
      }

      console.log("Likes count data:", likesCount);

      // Trier les IDs des tenues par nombre de likes
      const sortedOutfitIds = likesCount
        ?.map((item: any) => item.outfit_id)
        .slice(0, 20) || [];

      if (sortedOutfitIds.length === 0) {
        return [];
      }

      // Récupérer les détails des tenues triées
      const { data: outfits, error: outfitsError } = await supabase
        .from('outfits')
        .select(`
          *,
          top:clothes!outfits_top_id_fkey(*),
          bottom:clothes!outfits_bottom_id_fkey(*),
          shoes:clothes!outfits_shoes_id_fkey(*),
          user:profiles!outfits_user_id_profiles_fkey(username, avatar_url)
        `)
        .in('id', sortedOutfitIds);

      if (outfitsError) {
        console.error("Error fetching outfits details:", outfitsError);
        throw outfitsError;
      }

      // Réorganiser les tenues selon l'ordre des likes
      const orderedOutfits = sortedOutfitIds
        .map(id => outfits?.find(outfit => outfit.id === id))
        .filter(outfit => outfit !== undefined);

      console.log("Fetched trending outfits:", orderedOutfits);
      return orderedOutfits;
    },
  });

  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-2xl font-bold">Tenues Populaires</h2>
          {isLoading ? (
            <div>Chargement des tenues populaires...</div>
          ) : (
            <ScrollArea className="h-[500px] pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trendingOutfits?.map((outfit) => (
                  <Card key={outfit.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <img
                          src={outfit.user?.avatar_url || "/placeholder.svg"}
                          alt={outfit.user?.username}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <h3 className="text-xl font-semibold">{outfit.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            par {outfit.user?.username}
                          </p>
                        </div>
                      </div>
                      {outfit.description && (
                        <p className="text-sm text-muted-foreground mt-2">{outfit.description}</p>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <Shirt className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="font-medium">Haut</p>
                            {outfit.top ? (
                              <div className="flex items-center gap-2">
                                <img
                                  src={outfit.top.image_url || ""}
                                  alt={outfit.top.name}
                                  className="h-16 w-16 object-cover rounded-md"
                                />
                                <div>
                                  <p className="text-sm font-medium">{outfit.top.name}</p>
                                  {outfit.top.description && (
                                    <p className="text-xs text-muted-foreground">
                                      {outfit.top.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">Aucun haut sélectionné</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <PenSquare className="h-5 w-5 text-indigo-500" />
                          <div>
                            <p className="font-medium">Bas</p>
                            {outfit.bottom ? (
                              <div className="flex items-center gap-2">
                                <img
                                  src={outfit.bottom.image_url || ""}
                                  alt={outfit.bottom.name}
                                  className="h-16 w-16 object-cover rounded-md"
                                />
                                <div>
                                  <p className="text-sm font-medium">{outfit.bottom.name}</p>
                                  {outfit.bottom.description && (
                                    <p className="text-xs text-muted-foreground">
                                      {outfit.bottom.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">Aucun bas sélectionné</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <Footprints className="h-5 w-5 text-purple-500" />
                          <div>
                            <p className="font-medium">Chaussures</p>
                            {outfit.shoes ? (
                              <div className="flex items-center gap-2">
                                <img
                                  src={outfit.shoes.image_url || ""}
                                  alt={outfit.shoes.name}
                                  className="h-16 w-16 object-cover rounded-md"
                                />
                                <div>
                                  <p className="text-sm font-medium">{outfit.shoes.name}</p>
                                  {outfit.shoes.description && (
                                    <p className="text-xs text-muted-foreground">
                                      {outfit.shoes.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                Aucunes chaussures sélectionnées
                              </p>
                            )}
                          </div>
                        </div>

                        <OutfitInteractions outfitId={outfit.id} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default TrendingOutfits;
