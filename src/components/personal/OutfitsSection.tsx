
import React from "react";
import { Card } from "@/components/ui/card";
import { OutfitCard } from "./OutfitCard";

interface OutfitsSectionProps {
  outfits: any[];
}

export const OutfitsSection = ({ outfits }: OutfitsSectionProps) => {
  if (outfits.length === 0) {
    return (
      <Card className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Vos Tenues</h2>
        <p className="text-gray-500 mb-4">Vous n'avez pas encore créé de tenues.</p>
        <button className="bg-primary text-white px-4 py-2 rounded-md">
          Créer une tenue
        </button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">
        <span>Vos Tenues</span>
        <button className="text-sm bg-primary text-white px-3 py-1 rounded-md">
          Voir toutes
        </button>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {outfits.map((outfit) => (
          <OutfitCard key={outfit.id} outfit={outfit} />
        ))}
      </div>
    </Card>
  );
};
