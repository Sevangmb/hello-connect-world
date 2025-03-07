
import React from "react";
import { Card } from "@/components/ui/card";
import { Shirt, Layers, Tag, Star, StarOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FavoriteCardProps {
  item: any;
}

export const FavoriteCard: React.FC<FavoriteCardProps> = ({ item }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (item.type === 'outfit') {
      navigate(`/outfits/${item.id}`);
    } else if (item.type === 'clothes') {
      navigate(`/clothes/${item.id}`);
    }
  };
  
  const getTypeLabel = () => {
    if (item.type === 'outfit') return 'Tenue';
    if (item.type === 'clothes') {
      if (item.category) return item.category;
      return 'Vêtement';
    }
    return '';
  };
  
  const getIcon = () => {
    if (item.type === 'outfit') {
      return <Layers className="h-12 w-12 text-gray-400" />;
    }
    return <Shirt className="h-12 w-12 text-gray-400" />;
  };
  
  return (
    <Card 
      className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer relative"
      onClick={handleClick}
    >
      <div className="absolute top-2 right-2 z-10">
        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
      </div>
      
      <div className="aspect-square w-full relative bg-gray-50">
        {item.image_url ? (
          <img 
            src={item.image_url} 
            alt={item.name || 'Élément favori'} 
            className="object-cover w-full h-full"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            {getIcon()}
          </div>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="font-medium truncate">{item.name || 'Sans nom'}</h3>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {getTypeLabel()}
          </span>
          {item.brand && (
            <div className="flex items-center">
              <Tag className="h-3 w-3 mr-1 text-gray-400" />
              <span className="text-xs text-gray-500 truncate max-w-[80px]">
                {item.brand}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
