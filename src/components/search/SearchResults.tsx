import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ClothesCard } from "@/components/clothes/ClothesCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export const SearchResults = () => {
  const { data: results, isLoading } = useQuery({
    queryKey: ["search-results"],
    queryFn: async () => {
      console.log("Fetching search results");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      // Fetch clothes with all required fields
      const { data: clothes } = await supabase
        .from("clothes")
        .select(`
          id,
          name,
          description,
          category,
          subcategory,
          brand,
          size,
          color,
          material,
          style,
          price,
          purchase_date,
          image_url,
          created_at,
          user_id,
          archived,
          needs_alteration,
          profiles!clothes_user_id_profiles_fkey(username, avatar_url)
        `)
        .limit(10);

      // Fetch users
      const { data: users } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .limit(10);

      return {
        clothes: clothes?.map(cloth => ({
          ...cloth,
          archived: cloth.archived || false,
          needs_alteration: cloth.needs_alteration || false,
          subcategory: cloth.subcategory || '',
          brand: cloth.brand || '',
          size: cloth.size || '',
          color: cloth.color || '',
          material: cloth.material || '',
          style: cloth.style || '',
          price: cloth.price || 0,
          purchase_date: cloth.purchase_date || '',
        })) || [],
        users: users || [],
      };
    },
  });

  const handleDelete = async (id: string): Promise<void> => {
    console.log("Would delete item with id:", id);
    // Since this is a search results page, we probably don't want to actually
    // delete items here, but we need to satisfy the type requirement
    return Promise.resolve();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!results?.clothes.length && !results?.users.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun résultat trouvé
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {results.users.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Utilisateurs</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {results.users.map((user) => (
              <Button
                key={user.id}
                variant="outline"
                className="h-auto p-4 justify-start"
                onClick={() => console.log("Navigate to user profile", user.id)}
              >
                <Avatar className="h-10 w-10 mr-4">
                  <AvatarImage src={user.avatar_url || ""} />
                  <AvatarFallback>{user.username?.[0]}</AvatarFallback>
                </Avatar>
                <span>{user.username}</span>
              </Button>
            ))}
          </div>
        </section>
      )}

      {results.clothes.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Vêtements</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.clothes.map((cloth) => (
              <ClothesCard
                key={cloth.id}
                cloth={cloth}
                onDelete={handleDelete}
                isDeleting={false}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};