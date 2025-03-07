
import React from "react";
import { Card } from "@/components/ui/card";
import { FavoriteCard } from "./FavoriteCard";

export const FavoritesSection = () => (
  <Card className="p-6">
    <h2 className="text-xl font-semibold mb-4">Vos Favoris</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <FavoriteCard key={i} />
      ))}
    </div>
  </Card>
);
