
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOutfits } from '@/hooks/useOutfits';
import { useClothes } from '@/hooks/useClothes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClothesGrid } from '@/components/clothes/ClothesGrid';
import { OutfitStatus, OutfitCategory, OutfitSeason } from '@/core/outfits/domain/types';

interface CreateOutfitProps {
  onClose: () => void;
}

const CreateOutfit: React.FC<CreateOutfitProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const { createOutfit } = useOutfits();
  const [outfitName, setOutfitName] = useState('');
  const [selectedTop, setSelectedTop] = useState<any>(null);
  const [selectedBottom, setSelectedBottom] = useState<any>(null);
  const [selectedShoes, setSelectedShoes] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('top');

  const handleCreateOutfit = async () => {
    if (!outfitName) {
      alert('Please enter an outfit name');
      return;
    }

    if (!selectedTop || !selectedBottom || !selectedShoes) {
      alert('Please select all items');
      return;
    }

    try {
      const outfitData = {
        name: outfitName,
        top_id: selectedTop?.id,
        bottom_id: selectedBottom?.id,
        shoes_id: selectedShoes?.id,
        status: 'published' as OutfitStatus,
        season: 'all' as OutfitSeason,
        category: 'casual' as OutfitCategory
      };

      await createOutfit(outfitData);
      navigate('/outfits');
    } catch (error) {
      console.error('Failed to create outfit:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Outfit</h1>
      
      <div className="mb-4">
        <Input
          placeholder="Outfit Name"
          value={outfitName}
          onChange={(e) => setOutfitName(e.target.value)}
          className="mb-2"
        />
      </div>

      <Tabs defaultValue="top" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="top">Top</TabsTrigger>
          <TabsTrigger value="bottom">Bottom</TabsTrigger>
          <TabsTrigger value="shoes">Shoes</TabsTrigger>
        </TabsList>

        <TabsContent value="top">
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-2">Select a Top</h2>
            <ClothesTab 
              type="top" 
              selectedItem={selectedTop} 
              onSelectItem={setSelectedTop} 
            />
          </Card>
        </TabsContent>

        <TabsContent value="bottom">
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-2">Select a Bottom</h2>
            <ClothesTab 
              type="bottom" 
              selectedItem={selectedBottom} 
              onSelectItem={setSelectedBottom} 
            />
          </Card>
        </TabsContent>

        <TabsContent value="shoes">
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-2">Select Shoes</h2>
            <ClothesTab 
              type="shoes" 
              selectedItem={selectedShoes} 
              onSelectItem={setSelectedShoes} 
            />
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-4 flex flex-col sm:flex-row gap-4">
        <Button onClick={onClose} variant="outline">
          Cancel
        </Button>
        <Button onClick={handleCreateOutfit}>
          Create Outfit
        </Button>
      </div>
    </div>
  );
};

interface ClothesTabProps {
  type: string;
  selectedItem: any;
  onSelectItem: (item: any) => void;
}

const ClothesTab: React.FC<ClothesTabProps> = ({ type, selectedItem, onSelectItem }) => {
  const { clothes, loading } = useClothes({ 
    category: type === 'top' ? 'tops' : type === 'bottom' ? 'bottoms' : 'shoes'
  });

  return (
    <div>
      <ClothesGrid
        clothes={clothes}
        loading={loading}
        onSelectItem={onSelectItem}
        selectedItem={selectedItem}
      />
    </div>
  );
};

export default CreateOutfit;
