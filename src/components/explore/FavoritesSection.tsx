
import React from "react";
import { Card } from "@/components/ui/card";

export const FavoritesSection = () => (
  <Card className="p-6">
    <h2 className="text-xl font-semibold mb-4">Vos favoris</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <FavoriteCard key={i} />
      ))}
    </div>
  </Card>
);

const FavoriteCard = () => (
  <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
    <div className="aspect-square bg-gray-100 rounded mb-3"></div>
    <h3 className="font-medium">Titre du favori</h3>
    <p className="text-sm text-gray-600">Description courte</p>
  </div>
);
