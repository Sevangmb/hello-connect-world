
import React from "react";
import { Card } from "@/components/ui/card";
import { Shirt, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ClothingCardProps {
  item: any;
}

export const ClothingCard = ({ item }: ClothingCardProps) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate(`/clothes/${item.id}`);
  };
  
  return (
    <Card 
      className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="aspect-square w-full relative bg-gray-50">
        {item.image_url ? (
          <img 
            src={item.image_url} 
            alt={item.name} 
            className="object-cover w-full h-full"
            onError={(e) => {
              // Fallback si l'image ne charge pas
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Shirt className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium truncate">{item.name}</h3>
        <div className="flex justify-between items-center mt-1 flex-wrap">
          <span className="text-sm text-gray-500">{item.category}</span>
          {item.brand && (
            <div className="flex items-center mt-1">
              <Tag className="h-3 w-3 mr-1 text-gray-400" />
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full truncate max-w-[100px]">
                {item.brand}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
