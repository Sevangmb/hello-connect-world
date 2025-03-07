
import React from "react";
import { Card } from "@/components/ui/card";

export const TrendingSection = () => (
  <Card className="p-6">
    <h2 className="text-xl font-semibold mb-4">Tendances du moment</h2>
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <TrendingCard key={i} />
      ))}
    </div>
  </Card>
);

const TrendingCard = () => (
  <div className="flex items-center gap-4 p-4 border-b border-gray-200">
    <div className="text-xl font-bold text-gray-400">#1</div>
    <div>
      <h3 className="font-medium">Tendance populaire</h3>
      <p className="text-sm text-gray-600">
        Voir pourquoi c'est tendance
      </p>
    </div>
  </div>
);
