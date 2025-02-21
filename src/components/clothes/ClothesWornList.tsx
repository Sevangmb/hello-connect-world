
import { Loader2 } from "lucide-react";

interface ClothesWornListProps {
  isLoading: boolean;
  clothesForSelectedDate: Array<{
    id: string;
    clothes?: {
      name: string;
      image_url: string | null;
    };
  }>;
}

export const ClothesWornList = ({ isLoading, clothesForSelectedDate }: ClothesWornListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!clothesForSelectedDate || clothesForSelectedDate.length === 0) {
    return (
      <p className="text-muted-foreground">
        Aucun vêtement porté ce jour-là
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {clothesForSelectedDate.map((history) => (
        <div key={history.id} className="flex items-center gap-4">
          {history.clothes?.image_url && (
            <img 
              src={history.clothes.image_url} 
              alt={history.clothes.name}
              className="w-12 h-12 object-cover rounded"
            />
          )}
          <span>{history.clothes?.name}</span>
        </div>
      ))}
    </div>
  );
};
