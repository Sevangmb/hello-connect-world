import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface ShopDetailsDialogProps {
  shop: {
    id: string;
    name: string;
    description?: string;
    address?: string;
    phone?: string;
    website?: string;
    status: string;
    created_at?: string;
    shop_items?: any[];
    profiles?: { username?: string };
  };
  onClose: () => void;
}

export default function ShopDetailsDialog({ shop, onClose }: ShopDetailsDialogProps) {
  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Détails de la Boutique</DialogTitle>
        </DialogHeader>
        <Card className="mt-4">
          <CardContent>
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold">{shop.name}</h2>
                {shop.description && (
                  <p className="text-sm text-muted-foreground mt-1">{shop.description}</p>
                )}
              </div>
              <div>
                <p className="font-medium">Propriétaire :</p>
                <p>{shop.profiles?.username || "Inconnu"}</p>
              </div>
              <div className="flex flex-col gap-2">
                {shop.address && (
                  <div>
                    <span className="font-medium">Adresse : </span>
                    <span>{shop.address}</span>
                  </div>
                )}
                {shop.phone && (
                  <div>
                    <span className="font-medium">Téléphone : </span>
                    <span>{shop.phone}</span>
                  </div>
                )}
                {shop.website && (
                  <div>
                    <span className="font-medium">Site Web : </span>
                    <a
                      href={shop.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {shop.website}
                    </a>
                  </div>
                )}
              </div>
              <div>
                <span className="font-medium">Statut : </span>
                <Badge>
                  {shop.status.charAt(0).toUpperCase() + shop.status.slice(1)}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Nombre d'articles : </span>
                <span>{shop.shop_items ? shop.shop_items.length : 0}</span>
              </div>
              {shop.created_at && (
                <div>
                  <span className="font-medium">Créé le : </span>
                  <span>{format(new Date(shop.created_at), "dd/MM/yyyy")}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}