
import React from "react";
import { Card } from "@/components/ui/card";
import { ClothingCard } from "./ClothingCard";

interface ClothingSectionProps {
  items: any[];
}

export const ClothingSection = ({ items }: ClothingSectionProps) => {
  if (items.length === 0) {
    return (
      <Card className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Vos Vêtements</h2>
        <p className="text-gray-500 mb-4">Vous n'avez pas encore ajouté de vêtements.</p>
        <button className="bg-primary text-white px-4 py-2 rounded-md">
          Ajouter un vêtement
        </button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">
        <span>Vos Vêtements</span>
        <button className="text-sm bg-primary text-white px-3 py-1 rounded-md">
          Voir tous
        </button>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <ClothingCard key={item.id} item={item} />
        ))}
      </div>
    </Card>
  );
};
