
import React from "react";

interface ClothingCardProps {
  item: any;
}

export const ClothingCard = ({ item }: ClothingCardProps) => (
  <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
    <div className="aspect-square w-full relative">
      <img 
        src={item.image_url || '/placeholder.svg'} 
        alt={item.name} 
        className="object-cover w-full h-full"
      />
    </div>
    <div className="p-3">
      <h3 className="font-medium">{item.name}</h3>
      <div className="flex justify-between items-center mt-1">
        <span className="text-sm text-gray-500">{item.category}</span>
        {item.brand && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{item.brand}</span>}
      </div>
    </div>
  </div>
);
