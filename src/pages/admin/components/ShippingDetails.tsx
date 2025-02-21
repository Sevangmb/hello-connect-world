
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { OrderShipment } from "../types/orders";
import { isValidShippingAddress } from "../utils/shipping";

interface ShippingDetailsProps {
  shipment: OrderShipment;
}

export function ShippingDetails({ shipment }: ShippingDetailsProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Détails de l'expédition</DialogTitle>
        <DialogDescription>
          Informations sur l'expédition de la commande
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        {isValidShippingAddress(shipment.shipping_address) && (
          <div>
            <h4 className="font-medium mb-2">Adresse de livraison</h4>
            <p className="text-sm text-muted-foreground">
              {shipment.shipping_address.street}<br />
              {shipment.shipping_address.city}, {shipment.shipping_address.postal_code}<br />
              {shipment.shipping_address.country}
            </p>
          </div>
        )}
        <div>
          <h4 className="font-medium mb-2">Méthode d'expédition</h4>
          <p className="text-sm text-muted-foreground">
            {shipment.shipping_method}
          </p>
        </div>
        {shipment.tracking_number && (
          <div>
            <h4 className="font-medium mb-2">Numéro de suivi</h4>
            <p className="text-sm text-muted-foreground">
              {shipment.tracking_number}
            </p>
          </div>
        )}
      </div>
    </DialogContent>
  );
}
