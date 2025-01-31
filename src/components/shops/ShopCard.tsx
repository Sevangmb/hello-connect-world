import { useNavigate } from "react-router-dom";
import { ShoppingBag, MapPin, Phone, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ShopCardProps = {
  shop: {
    id: string;
    name: string;
    description: string | null;
    address: string | null;
    phone: string | null;
    website: string | null;
    average_rating: number | null;
    shop_items: { id: string }[];
    profiles: { username: string | null };
  };
};

export const ShopCard = ({ shop }: ShopCardProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/shops/${shop.id}`)}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{shop.name}</span>
          <ShoppingBag className="h-5 w-5 text-gray-400" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">{shop.description}</p>
        <div className="flex flex-col gap-2">
          {shop.address && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{shop.address}</span>
            </div>
          )}
          {shop.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-4 w-4" />
              <span>{shop.phone}</span>
            </div>
          )}
          {shop.website && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Globe className="h-4 w-4" />
              <span>{shop.website}</span>
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Par {shop.profiles?.username || 'Inconnu'}
          </span>
          <Badge variant="secondary">
            {shop.shop_items?.length || 0} articles
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};