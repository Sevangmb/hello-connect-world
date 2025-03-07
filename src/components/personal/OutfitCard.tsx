
import React from "react";

interface OutfitCardProps {
  outfit: any;
}

export const OutfitCard = ({ outfit }: OutfitCardProps) => (
  <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
    <div className="p-3 border-b bg-gray-50">
      <h3 className="font-medium">{outfit.name || "Tenue sans nom"}</h3>
      {outfit.season && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{outfit.season}</span>}
    </div>
    <div className="grid grid-cols-3 gap-1 p-3">
      <div className="aspect-square bg-gray-100 rounded">
        {outfit.top_id && outfit.top_id.image_url && (
          <img src={outfit.top_id.image_url} alt="Haut" className="w-full h-full object-cover" />
        )}
      </div>
      <div className="aspect-square bg-gray-100 rounded">
        {outfit.bottom_id && outfit.bottom_id.image_url && (
          <img src={outfit.bottom_id.image_url} alt="Bas" className="w-full h-full object-cover" />
        )}
      </div>
      <div className="aspect-square bg-gray-100 rounded">
        {outfit.shoes_id && outfit.shoes_id.image_url && (
          <img src={outfit.shoes_id.image_url} alt="Chaussures" className="w-full h-full object-cover" />
        )}
      </div>
    </div>
  </div>
);
