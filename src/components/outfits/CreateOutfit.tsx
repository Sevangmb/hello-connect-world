import { useState } from "react";
import { useClothes } from "@/hooks/useClothes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
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

      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Utilisateur non connecté");
      }

      const { error } = await supabase.from("outfits").insert({
        name,
        description: description || null,
        top_id: selectedTop,
        bottom_id: selectedBottom,
        shoes_id: selectedShoes,
        user_id: user.id,
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

      // Refresh outfits list
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

  const ClothingSection = ({ 
    title, 
    items, 
    selectedId, 
    onSelect 
  }: { 
    title: string;
    items: any[];
    selectedId: string | null;
    onSelect: (id: string) => void;
  }) => (
    <div className="space-y-2">
      <h3 className="font-medium text-lg">{title}</h3>
      <ScrollArea className="h-[300px] border rounded-lg p-4">
        <div className="space-y-2">
          {items?.map((item) => (
            <div
              key={item.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedId === item.id
                  ? "border-primary bg-primary/10"
                  : "hover:bg-muted"
              }`}
              onClick={() => onSelect(item.id)}
            >
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
              )}
              <p className="font-medium">{item.name}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

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

      <div className="space-y-6">
        <ClothingSection
          title="Hauts"
          items={tops || []}
          selectedId={selectedTop}
          onSelect={setSelectedTop}
        />
        <ClothingSection
          title="Bas"
          items={bottoms || []}
          selectedId={selectedBottom}
          onSelect={setSelectedBottom}
        />
        <ClothingSection
          title="Chaussures"
          items={shoes || []}
          selectedId={selectedShoes}
          onSelect={setSelectedShoes}
        />
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