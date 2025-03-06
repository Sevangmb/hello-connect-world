import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClothesGrid } from "@/components/clothes/ClothesGrid";
import { useClothes, ClothesFilters } from "@/hooks/useClothes";
import { useOutfits } from "@/hooks/useOutfits";
import { OutfitCategory, OutfitSeason, OutfitStatus } from '@/core/outfits/domain/types';

const CATEGORIES = [
  "casual",
  "formal",
  "sporty",
  "work",
  "party",
];

const SEASONS = [
  "all",
  "spring",
  "summer",
  "autumn",
  "winter",
];

const STATUSES = [
  "published",
  "draft",
  "private",
];

const CreateOutfit = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { createOutfit } = useOutfits();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [topId, setTopId] = useState<string | null>(null);
  const [bottomId, setBottomId] = useState<string | null>(null);
  const [shoesId, setShoesId] = useState<string | null>(null);
  const [category, setCategory] = useState<OutfitCategory>('casual');
  const [season, setSeason] = useState<OutfitSeason>('all');
  const [status, setStatus] = useState<OutfitStatus>('published');

  const [searchTop, setSearchTop] = useState('');
  const [searchBottom, setSearchBottom] = useState('');
  const [searchShoes, setSearchShoes] = useState('');

  // Fix the clothing filter objects to use the updated ClothesFilters interface
  const topFilters = {
    category: "Hauts",
    search: searchTop
  };

  const bottomFilters = {
    category: "Bas",
    search: searchBottom
  };

  const shoesFilters = {
    category: "Chaussures",
    search: searchShoes
  };

  const { clothes: tops } = useClothes(topFilters);
  const { clothes: bottoms } = useClothes(bottomFilters);
  const { clothes: shoes } = useClothes(shoesFilters);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      toast({
        title: "Erreur",
        description: "Le nom de la tenue est obligatoire.",
        variant: "destructive",
      });
      return;
    }

    if (!topId || !bottomId || !shoesId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un haut, un bas et des chaussures.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newOutfit = await createOutfit({
        name,
        description,
        top_id: topId,
        bottom_id: bottomId,
        shoes_id: shoesId,
        category,
        season,
        status,
      });

      if (newOutfit) {
        toast({
          title: "Tenue créée",
          description: "La tenue a été créée avec succès.",
        });
        router.push('/profile/outfits');
      } else {
        toast({
          title: "Erreur",
          description: "Erreur lors de la création de la tenue.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de la création de la tenue.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Créer une nouvelle tenue</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Nom de la tenue</Label>
          <Input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <Label>Catégorie</Label>
          <Select value={category} onValueChange={(value) => setCategory(value as OutfitCategory)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Saison</Label>
          <Select value={season} onValueChange={(value) => setSeason(value as OutfitSeason)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner une saison" />
            </SelectTrigger>
            <SelectContent>
              {SEASONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Statut</Label>
          <Select value={status} onValueChange={(value) => setStatus(value as OutfitStatus)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Haut</Label>
          <Input
            type="text"
            placeholder="Rechercher un haut..."
            value={searchTop}
            onChange={(e) => setSearchTop(e.target.value)}
          />
          <ClothesGrid
            clothes={tops}
            selectedId={topId}
            onSelect={(id) => setTopId(id)}
            category="Hauts"
          />
        </div>

        <div>
          <Label>Bas</Label>
          <Input
            type="text"
            placeholder="Rechercher un bas..."
            value={searchBottom}
            onChange={(e) => setSearchBottom(e.target.value)}
          />
          <ClothesGrid
            clothes={bottoms}
            selectedId={bottomId}
            onSelect={(id) => setBottomId(id)}
            category="Bas"
          />
        </div>

        <div>
          <Label>Chaussures</Label>
          <Input
            type="text"
            placeholder="Rechercher des chaussures..."
            value={searchShoes}
            onChange={(e) => setSearchShoes(e.target.value)}
          />
          <ClothesGrid
            clothes={shoes}
            selectedId={shoesId}
            onSelect={(id) => setShoesId(id)}
            category="Chaussures"
          />
        </div>

        <Button type="submit">Créer la tenue</Button>
      </form>
    </div>
  );
};

export default CreateOutfit;
