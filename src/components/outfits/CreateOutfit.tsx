import { useState } from "react";
import { useClothes } from "@/hooks/useClothes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const CreateOutfit = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTop, setSelectedTop] = useState<string | null>(null);
  const [selectedBottom, setSelectedBottom] = useState<string | null>(null);
  const [selectedShoes, setSelectedShoes] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { data: tops, isLoading: topsLoading } = useClothes({ category: "haut" });
  const { data: bottoms, isLoading: bottomsLoading } = useClothes({ category: "bas" });
  const { data: shoes, isLoading: shoesLoading } = useClothes({ category: "chaussures" });

  const handleSave = async () => {
    if (!name) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez donner un nom à votre tenue",
      });
      return;
    }

    try {
      setIsSaving(true);
      const { error } = await supabase.from("outfits").insert({
        name,
        description: description || null,
        top_id: selectedTop,
        bottom_id: selectedBottom,
        shoes_id: selectedShoes,
      });

      if (error) throw error;

      toast({
        title: "Tenue enregistrée",
        description: "Votre tenue a été enregistrée avec succès",
      });

      // Reset form
      setName("");
      setDescription("");
      setSelectedTop(null);
      setSelectedBottom(null);
      setSelectedShoes(null);

      // Refresh outfits list if we implement it later
      queryClient.invalidateQueries({ queryKey: ["outfits"] });
    } catch (error: any) {
      console.error("Error saving outfit:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'enregistrer la tenue",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const isLoading = topsLoading || bottomsLoading || shoesLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom de la tenue</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ma tenue d'été"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (optionnelle)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Une description de votre tenue..."
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-4">
          <h3 className="font-medium">Haut</h3>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {tops?.map((top) => (
              <div
                key={top.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedTop === top.id
                    ? "border-primary bg-primary/10"
                    : "hover:bg-muted"
                }`}
                onClick={() => setSelectedTop(top.id)}
              >
                {top.image_url && (
                  <img
                    src={top.image_url}
                    alt={top.name}
                    className="w-full h-32 object-cover rounded-md mb-2"
                  />
                )}
                <p className="font-medium">{top.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Bas</h3>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {bottoms?.map((bottom) => (
              <div
                key={bottom.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedBottom === bottom.id
                    ? "border-primary bg-primary/10"
                    : "hover:bg-muted"
                }`}
                onClick={() => setSelectedBottom(bottom.id)}
              >
                {bottom.image_url && (
                  <img
                    src={bottom.image_url}
                    alt={bottom.name}
                    className="w-full h-32 object-cover rounded-md mb-2"
                  />
                )}
                <p className="font-medium">{bottom.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Chaussures</h3>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {shoes?.map((shoe) => (
              <div
                key={shoe.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedShoes === shoe.id
                    ? "border-primary bg-primary/10"
                    : "hover:bg-muted"
                }`}
                onClick={() => setSelectedShoes(shoe.id)}
              >
                {shoe.image_url && (
                  <img
                    src={shoe.image_url}
                    alt={shoe.name}
                    className="w-full h-32 object-cover rounded-md mb-2"
                  />
                )}
                <p className="font-medium">{shoe.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Enregistrer la tenue
            </>
          )}
        </Button>
      </div>
    </div>
  );
};