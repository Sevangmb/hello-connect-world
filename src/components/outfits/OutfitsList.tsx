
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Shirt, PenSquare, Footprints } from "lucide-react";
import { OutfitInteractions } from "./OutfitInteractions";

export const OutfitsList = () => {
  const { data: outfits, isLoading } = useQuery({
    queryKey: ["outfits"],
    queryFn: async () => {
      console.log("Fetching outfits...");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("outfits")
        .select(`
          *,
          top:clothes!outfits_top_id_fkey(*),
          bottom:clothes!outfits_bottom_id_fkey(*),
          shoes:clothes!outfits_shoes_id_fkey(*)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching outfits:", error);
        throw error;
      }

      console.log("Fetched outfits:", data);
      return data;
    },
  });

  if (isLoading) {
    return <div>Chargement des tenues...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Mes tenues ({outfits?.length || 0})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {outfits?.map((outfit) => (
          <Card key={outfit.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <h3 className="text-xl font-semibold">{outfit.name}</h3>
              {outfit.description && (
                <p className="text-sm text-muted-foreground">{outfit.description}</p>
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
                            <p className="text-xs text-muted-foreground">{outfit.top.description}</p>
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
                            <p className="text-xs text-muted-foreground">{outfit.bottom.description}</p>
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
                            <p className="text-xs text-muted-foreground">{outfit.shoes.description}</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Aucunes chaussures sélectionnées</p>
                    )}
                  </div>
                </div>

                <OutfitInteractions outfitId={outfit.id} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
