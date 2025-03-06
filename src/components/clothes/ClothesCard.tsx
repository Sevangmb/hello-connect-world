import React from 'react';

export interface ClothesCardProps {
  cloth: any;
  simple?: boolean;
}

export const ClothesCard: React.FC<ClothesCardProps> = ({ cloth, simple = false }) => {
  return (
    <Card className={cloth.archived ? "opacity-75" : ""}>
      {cloth.image_url && (
        <img
          src={cloth.image_url}
          alt={cloth.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      )}
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <div className="space-y-1">
            <span>{cloth.name}</span>
            <div className="flex flex-wrap gap-1">
              {cloth.archived && (
                <Badge variant="secondary">Archivé</Badge>
              )}
              {cloth.needs_alteration && (
                <Badge variant="destructive">À retoucher</Badge>
              )}
            </div>
          </div>
          <span className="text-sm font-normal text-muted-foreground">
            {cloth.category}
            {cloth.subcategory && ` - ${cloth.subcategory}`}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {cloth.description && (
          <p className="text-muted-foreground">{cloth.description}</p>
        )}
        <div className="grid grid-cols-2 gap-2 text-sm">
          {cloth.brand && (
            <div>
              <span className="font-medium">Marque:</span> {cloth.brand}
            </div>
          )}
          {cloth.size && (
            <div>
              <span className="font-medium">Taille:</span> {cloth.size}
            </div>
          )}
          {cloth.color && (
            <div>
              <span className="font-medium">Couleur:</span> {cloth.color}
            </div>
          )}
          {cloth.material && (
            <div>
              <span className="font-medium">Matière:</span> {cloth.material}
            </div>
          )}
          {cloth.style && (
            <div>
              <span className="font-medium">Style:</span> {cloth.style}
            </div>
          )}
          {cloth.price && (
            <div>
              <span className="font-medium">Prix:</span> {formatPrice(cloth.price)}
            </div>
          )}
          {cloth.purchase_date && (
            <div>
              <span className="font-medium">Acheté le:</span>{" "}
              {new Date(cloth.purchase_date).toLocaleDateString()}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onAlterationToggle(cloth.id, !cloth.needs_alteration)}
          disabled={isUpdating}
          title={cloth.needs_alteration ? "Marquer comme retouché" : "Marquer à retoucher"}
        >
          <Scissors className={`h-4 w-4 ${cloth.needs_alteration ? "text-destructive" : ""}`} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onArchive(cloth.id, !cloth.archived)}
          disabled={isUpdating}
          title={cloth.archived ? "Désarchiver" : "Archiver"}
        >
          <Archive className={`h-4 w-4 ${cloth.archived ? "text-muted-foreground" : ""}`} />
        </Button>
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
