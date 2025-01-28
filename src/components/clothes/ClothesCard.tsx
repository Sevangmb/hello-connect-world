import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { EditClothesDialog } from "./EditClothesDialog";

type ClothesCardProps = {
  cloth: {
    id: string;
    name: string;
    description: string | null;
    category: string;
    image_url: string | null;
  };
  onDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
};

export const ClothesCard = ({ cloth, onDelete, isDeleting }: ClothesCardProps) => {
  return (
    <Card>
      {cloth.image_url && (
        <img
          src={cloth.image_url}
          alt={cloth.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      )}
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span>{cloth.name}</span>
          <span className="text-sm font-normal text-muted-foreground">
            {cloth.category}
          </span>
        </CardTitle>
      </CardHeader>
      {cloth.description && (
        <CardContent>
          <p className="text-muted-foreground">{cloth.description}</p>
        </CardContent>
      )}
      <CardFooter className="flex justify-end gap-2">
        <EditClothesDialog 
          clothes={cloth}
          trigger={
            <Button variant="outline" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
          }
        />
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => onDelete(cloth.id)}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};