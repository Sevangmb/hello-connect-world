import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Loader2, Archive, Scissors } from "lucide-react";
import { EditClothesDialog } from "./EditClothesDialog";
import { formatPrice } from "@/lib/utils";

type ClothesCardProps = {
  cloth: {
    id: string;
    name: string;
    description: string | null;
    category: string;
    subcategory: string | null;
    brand: string | null;
    size: string | null;
    color: string | null;
    material: string | null;
    style: string | null;
    price: number | null;
    purchase_date: string | null;
    image_url: string | null;
    archived: boolean;
    needs_alteration: boolean;
  };
  onDelete: (id: string) => Promise<void>;
  onArchive: (id: string, archived: boolean) => Promise<void>;
  onAlterationToggle: (id: string, needsAlteration: boolean) => Promise<void>;
  isDeleting: boolean;
  isUpdating: boolean;
};

const Image = ({ imageUrl, name }: { imageUrl: string, name: string }) => (
  <img
    src={imageUrl}
    alt={name}
    className="w-full h-48 object-cover rounded-t-lg"
  />
);

const CardBadges = ({ archived, needsAlteration }: { archived: boolean, needsAlteration: boolean }) => (
  <div className="flex flex-wrap gap-1">
    {archived && <Badge variant="secondary">Archivé</Badge>}
    {needsAlteration && <Badge variant="destructive">À retoucher</Badge>}
  </div>
);

const CardDetails = ({ cloth }: { cloth: ClothesCardProps['cloth'] }) => (
  <div className="grid grid-cols-2 gap-2 text-sm">
    {cloth.brand && <div><span className="font-medium">Marque:</span> {cloth.brand}</div>}
    {cloth.size && <div><span className="font-medium">Taille:</span> {cloth.size}</div>}
    {cloth.color && <div><span className="font-medium">Couleur:</span> {cloth.color}</div>}
    {cloth.material && <div><span className="font-medium">Matière:</span> {cloth.material}</div>}
    {cloth.style && <div><span className="font-medium">Style:</span> {cloth.style}</div>}
    {cloth.price && <div><span className="font-medium">Prix:</span> {formatPrice(cloth.price)}</div>}
    {cloth.purchase_date && <div><span className="font-medium">Acheté le:</span> {new Date(cloth.purchase_date).toLocaleDateString()}</div>}
  </div>
);

const ActionButton = ({ onClick, disabled, title, icon: Icon, className }: { onClick: () => void, disabled: boolean, title: string, icon: any, className?: string }) => (
  <Button
    variant="outline"
    size="icon"
    onClick={onClick}
    disabled={disabled}
    title={title}
  >
    <Icon className={`h-4 w-4 ${className}`} />
  </Button>
);

export const ClothesCard = ({ 
  cloth, 
  onDelete, 
  onArchive,
  onAlterationToggle,
  isDeleting,
  isUpdating 
}: ClothesCardProps) => {
  return (
    <Card className={cloth.archived ? "opacity-75" : ""}>
      {cloth.image_url && <Image imageUrl={cloth.image_url} name={cloth.name} />}
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <div className="space-y-1">
            <span>{cloth.name}</span>
            <CardBadges archived={cloth.archived} needsAlteration={cloth.needs_alteration} />
          </div>
          <span className="text-sm font-normal text-muted-foreground">
            {cloth.category}
            {cloth.subcategory && ` - ${cloth.subcategory}`}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {cloth.description && <p className="text-muted-foreground">{cloth.description}</p>}
        <CardDetails cloth={cloth} />
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <ActionButton
          onClick={() => onAlterationToggle(cloth.id, !cloth.needs_alteration)}
          disabled={isUpdating}
          title={cloth.needs_alteration ? "Marquer comme retouché" : "Marquer à retoucher"}
          icon={Scissors}
          className={cloth.needs_alteration ? "text-destructive" : ""}
        />
        <ActionButton
          onClick={() => onArchive(cloth.id, !cloth.archived)}
          disabled={isUpdating}
          title={cloth.archived ? "Désarchiver" : "Archiver"}
          icon={Archive}
          className={cloth.archived ? "text-muted-foreground" : ""}
        />
        <EditClothesDialog 
          clothes={cloth}
          trigger={
            <Button variant="outline" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
          }
        />
        <ActionButton
          onClick={() => onDelete(cloth.id)}
          disabled={isDeleting}
          title="Supprimer"
          icon={Trash2}
        />
      </CardFooter>
    </Card>
  );
};
