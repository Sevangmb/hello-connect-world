
import React from "react";
import { Card } from "@/components/ui/card";
import { ClothingCard } from "./ClothingCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ClothingSectionProps {
  items: any[];
}

export const ClothingSection = ({ items }: ClothingSectionProps) => {
  const navigate = useNavigate();
  
  const handleAddClothing = () => {
    navigate("/clothes/add");
  };

  if (items.length === 0) {
    return (
      <Card className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Vos Vêtements</h2>
        <p className="text-gray-500 mb-4">Vous n'avez pas encore ajouté de vêtements.</p>
        <Button onClick={handleAddClothing} className="bg-primary text-white px-4 py-2 rounded-md">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un vêtement
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Vos Vêtements</h2>
        <div className="flex space-x-2">
          <Button onClick={handleAddClothing} size="sm" className="bg-primary text-white">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate("/clothes")}>
            Voir tous
          </Button>
        </div>
      </div>
      
      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <ClothingCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">Chargement des vêtements...</p>
      )}
    </Card>
  );
};
