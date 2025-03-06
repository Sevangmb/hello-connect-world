import React, { useState } from 'react';
import { useRouter } from 'react-router-dom'; // Changed from next/navigation
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useClothes, ClothesFilters } from '@/hooks/useClothes';
import { useOutfits } from '@/hooks/useOutfits';
import { Loader2 } from 'lucide-react';
import { ClothesGrid } from '@/components/clothes/ClothesGrid';

export function CreateOutfit() {
  const router = useRouter();
  const [selectedTop, setSelectedTop] = useState(null);
  const [selectedBottom, setSelectedBottom] = useState(null);
  const [selectedShoes, setSelectedShoes] = useState(null);
  const [outfitName, setOutfitName] = useState('');
  const { createOutfit, loading: creatingOutfit } = useOutfits();

  // Use the updated hook for tops
  const { clothes: tops, loading: loadingTops } = useClothes({
    category: 'top'
  });

  // Use the updated hook for bottoms
  const { clothes: bottoms, loading: loadingBottoms } = useClothes({
    category: 'bottom'
  });

  // Use the updated hook for shoes
  const { clothes: shoes, loading: loadingShoes } = useClothes({
    category: 'shoes'
  });

  const handleCreate = async () => {
    if (!outfitName) return;

    try {
      const outfitData = {
        name: outfitName,
        top_id: selectedTop?.id,
        bottom_id: selectedBottom?.id,
        shoes_id: selectedShoes?.id,
        status: 'published',
        season: 'all',
        category: 'casual'
      };

      const outfit = await createOutfit(outfitData);
      router.navigate(`/outfits/${outfit.id}`);
    } catch (error) {
      console.error('Error creating outfit:', error);
    }
  };

  const renderTopSelection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Sélectionnez un haut</h3>
      <ClothesGrid 
        clothes={tops} 
        loading={loadingTops} 
        onSelectItem={setSelectedTop}
        selectedItem={selectedTop}
      />
    </div>
  );

  const renderBottomSelection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Sélectionnez un bas</h3>
      <ClothesGrid 
        clothes={bottoms} 
        loading={loadingBottoms} 
        onSelectItem={setSelectedBottom}
        selectedItem={selectedBottom}
      />
    </div>
  );

  const renderShoesSelection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Sélectionnez des chaussures</h3>
      <ClothesGrid 
        clothes={shoes} 
        loading={loadingShoes} 
        onSelectItem={setSelectedShoes}
        selectedItem={selectedShoes}
      />
    </div>
  );

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Créer une tenue</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-4">
          <h2 className="font-semibold mb-2">Haut sélectionné</h2>
          {selectedTop ? (
            <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center">
              {selectedTop.image_url ? (
                <img 
                  src={selectedTop.image_url} 
                  alt={selectedTop.name} 
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <span className="text-gray-400">{selectedTop.name}</span>
              )}
            </div>
          ) : (
            <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center">
              <span className="text-gray-400">Aucun haut sélectionné</span>
            </div>
          )}
        </Card>
        
        <Card className="p-4">
          <h2 className="font-semibold mb-2">Bas sélectionné</h2>
          {selectedBottom ? (
            <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center">
              {selectedBottom.image_url ? (
                <img 
                  src={selectedBottom.image_url} 
                  alt={selectedBottom.name} 
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <span className="text-gray-400">{selectedBottom.name}</span>
              )}
            </div>
          ) : (
            <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center">
              <span className="text-gray-400">Aucun bas sélectionné</span>
            </div>
          )}
        </Card>
        
        <Card className="p-4">
          <h2 className="font-semibold mb-2">Chaussures sélectionnées</h2>
          {selectedShoes ? (
            <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center">
              {selectedShoes.image_url ? (
                <img 
                  src={selectedShoes.image_url} 
                  alt={selectedShoes.name} 
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <span className="text-gray-400">{selectedShoes.name}</span>
              )}
            </div>
          ) : (
            <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center">
              <span className="text-gray-400">Aucune chaussure sélectionnée</span>
            </div>
          )}
        </Card>
      </div>
      
      <div className="mb-6">
        <label htmlFor="outfitName" className="block text-sm font-medium mb-1">
          Nom de la tenue
        </label>
        <input
          type="text"
          id="outfitName"
          value={outfitName}
          onChange={(e) => setOutfitName(e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="Ma tenue d'été..."
        />
      </div>
      
      <Tabs defaultValue="tops">
        <TabsList className="w-full">
          <TabsTrigger value="tops" className="flex-1">Hauts</TabsTrigger>
          <TabsTrigger value="bottoms" className="flex-1">Bas</TabsTrigger>
          <TabsTrigger value="shoes" className="flex-1">Chaussures</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tops">
          {renderTopSelection()}
        </TabsContent>
        
        <TabsContent value="bottoms">
          {renderBottomSelection()}
        </TabsContent>
        
        <TabsContent value="shoes">
          {renderShoesSelection()}
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-end">
        <Button 
          onClick={handleCreate} 
          disabled={!outfitName || creatingOutfit}
        >
          {creatingOutfit ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Création en cours...
            </>
          ) : (
            'Créer la tenue'
          )}
        </Button>
      </div>
    </div>
  );
}
