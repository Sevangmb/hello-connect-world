import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      <h2 className="text-2xl font-bold">Mes tenues</h2>
      <ScrollArea className="h-[300px]">
        <div className="space-y-4">
          {outfits?.map((outfit) => (
            <Card key={outfit.id} className="p-4">
              <h3 className="font-semibold">{outfit.name}</h3>
              {outfit.description && (
                <p className="text-sm text-gray-500">{outfit.description}</p>
              )}
              <div className="mt-4 grid grid-cols-3 gap-4">
                {outfit.top && (
                  <div>
                    <p className="text-sm font-medium">Haut</p>
                    <img
                      src={outfit.top.image_url || ""}
                      alt={outfit.top.name}
                      className="mt-1 h-24 w-24 object-cover rounded-md"
                    />
                  </div>
                )}
                {outfit.bottom && (
                  <div>
                    <p className="text-sm font-medium">Bas</p>
                    <img
                      src={outfit.bottom.image_url || ""}
                      alt={outfit.bottom.name}
                      className="mt-1 h-24 w-24 object-cover rounded-md"
                    />
                  </div>
                )}
                {outfit.shoes && (
                  <div>
                    <p className="text-sm font-medium">Chaussures</p>
                    <img
                      src={outfit.shoes.image_url || ""}
                      alt={outfit.shoes.name}
                      className="mt-1 h-24 w-24 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};