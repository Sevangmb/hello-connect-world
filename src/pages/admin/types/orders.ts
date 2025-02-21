
export interface ShippingAddress {
  street: string;
  city: string;
  postal_code: string;
  country: string;
}

export interface OrderShipment {
  id: string;
  shipping_method: string;
  tracking_number: string | null;
  tracking_url: string | null;
  shipping_cost: number | null;
  status: string;
  shipping_address: ShippingAddress;
}

export interface OrderItem {
  quantity: number;
  shop_items: {
    price: number;
    clothes: {
      name: string;
    };
  };
}

export interface Order {
  id: string;
  created_at: string;
  buyer: {
    username: string | null;
  } | null;
  order_items: OrderItem[];
  total_amount: number;
  status: keyof typeof statusLabels;
  order_shipments: OrderShipment[];
}

export const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  shipped: "bg-blue-100 text-blue-800",
  delivered: "bg-purple-100 text-purple-800",
  cancelled: "bg-red-100 text-red-800",
} as const;

export const statusLabels = {
  pending: "En attente",
  paid: "Payée",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
} as const;

