
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Shirt, PenSquare, Footprints, Hash } from "lucide-react";
import { OutfitInteractions } from "@/components/outfits/OutfitInteractions";
import type { Outfit } from "@/types/outfits";
import { useNavigate } from "react-router-dom";

interface TrendingOutfitCardProps {
  outfit: Outfit;
}

export const TrendingOutfitCard = ({ outfit }: TrendingOutfitCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-lg transition-shadow">
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
        {outfit.hashtags && outfit.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {outfit.hashtags.map((hashtag) => (
              <button
                key={hashtag.id}
                onClick={() => navigate(`/hashtag/${hashtag.name}`)}
                className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-full text-sm hover:bg-muted/80 transition-colors"
              >
                <Hash className="h-3 w-3" />
                {hashtag.name}
              </button>
            ))}
          </div>
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
  );
};
