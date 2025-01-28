import { useState } from "react";
import { useClothes } from "@/hooks/useClothes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Save, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const CreateOutfit = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTop, setSelectedTop] = useState<string | null>(null);
  const [selectedBottom, setSelectedBottom] = useState<string | null>(null);
  const [selectedShoes, setSelectedShoes] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<"tops" | "bottoms" | "shoes" | null>(null);

  const [topSource, setTopSource] = useState<"mine" | "friends">("mine");
  const [bottomSource, setBottomSource] = useState<"mine" | "friends">("mine");
  const [shoesSource, setShoesSource] = useState<"mine" | "friends">("mine");

  const { data: tops, isLoading: topsLoading } = useClothes({ 
    category: "Hauts",
    source: topSource,
    search: activeSection === "tops" ? searchQuery : undefined
  });
  const { data: bottoms, isLoading: bottomsLoading } = useClothes({ 
    category: "Bas",
    source: bottomSource,
    search: activeSection === "bottoms" ? searchQuery : undefined
  });
  const { data: shoes, isLoading: shoesLoading } = useClothes({ 
    category: "Chaussures",
    source: shoesSource,
    search: activeSection === "shoes" ? searchQuery : undefined
  });

  const handleSave = async () => {
    console.log("Saving outfit with values:", {
      name,
      description,
      top_id: selectedTop,
      bottom_id: selectedBottom,
      shoes_id: selectedShoes
    });

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

      if (error) {
        console.error("Error inserting outfit:", error);
        throw error;
      }

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

  const handleSearch = (section: "tops" | "bottoms" | "shoes") => {
    setActiveSection(section);
    setIsSearchOpen(true);
  };

  const handleSelectItem = (id: string) => {
    switch (activeSection) {
      case "tops":
        setSelectedTop(id);
        break;
      case "bottoms":
        setSelectedBottom(id);
        break;
      case "shoes":
        setSelectedShoes(id);
        break;
    }
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const ClothingSection = ({ 
    title, 
    items, 
    selectedId, 
    onSelect,
    source,
    onSourceChange,
    section,
  }: { 
    title: string;
    items: any[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    source: "mine" | "friends";
    onSourceChange: (value: "mine" | "friends") => void;
    section: "tops" | "bottoms" | "shoes";
  }) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-lg">{title}</h3>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleSearch(section)}
          >
            <Search className="h-4 w-4 mr-2" />
            Rechercher
          </Button>
          <RadioGroup 
            value={source} 
            onValueChange={(value: "mine" | "friends") => onSourceChange(value)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mine" id={`mine-${title}`} />
              <Label htmlFor={`mine-${title}`}>Mes vêtements</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="friends" id={`friends-${title}`} />
              <Label htmlFor={`friends-${title}`}>Vêtements de mes amis</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
      {items && items.length > 0 ? (
        <div className="relative px-12">
          <Carousel opts={{ align: "center" }}>
            <CarouselContent>
              {items.map((item) => (
                <CarouselItem key={item.id} className="basis-full">
                  <div
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
                        className="w-full h-32 object-contain rounded-md mb-2"
                      />
                    )}
                    <p className="font-medium text-center">{item.name}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute -left-2 top-1/2 -translate-y-1/2">
              <CarouselPrevious />
            </div>
            <div className="absolute -right-2 top-1/2 -translate-y-1/2">
              <CarouselNext />
            </div>
          </Carousel>
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-8">
          Aucun vêtement trouvé dans cette catégorie
        </p>
      )}
    </div>
  );

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

      <div className="space-y-6">
        <ClothingSection
          title="Hauts"
          items={tops || []}
          selectedId={selectedTop}
          onSelect={setSelectedTop}
          source={topSource}
          onSourceChange={setTopSource}
          section="tops"
        />
        <ClothingSection
          title="Bas"
          items={bottoms || []}
          selectedId={selectedBottom}
          onSelect={setSelectedBottom}
          source={bottomSource}
          onSourceChange={setBottomSource}
          section="bottoms"
        />
        <ClothingSection
          title="Chaussures"
          items={shoes || []}
          selectedId={selectedShoes}
          onSelect={setSelectedShoes}
          source={shoesSource}
          onSourceChange={setShoesSource}
          section="shoes"
        />
      </div>

      <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <CommandInput 
          placeholder="Rechercher un vêtement..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
          <CommandGroup>
            {activeSection === "tops" && tops?.map((item) => (
              <CommandItem
                key={item.id}
                value={item.name}
                onSelect={() => handleSelectItem(item.id)}
              >
                {item.name}
              </CommandItem>
            ))}
            {activeSection === "bottoms" && bottoms?.map((item) => (
              <CommandItem
                key={item.id}
                value={item.name}
                onSelect={() => handleSelectItem(item.id)}
              >
                {item.name}
              </CommandItem>
            ))}
            {activeSection === "shoes" && shoes?.map((item) => (
              <CommandItem
                key={item.id}
                value={item.name}
                onSelect={() => handleSelectItem(item.id)}
              >
                {item.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

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