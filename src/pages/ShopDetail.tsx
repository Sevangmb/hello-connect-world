
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useShop } from "@/hooks/useShop";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, MapPin, Globe, Phone } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import ShopItems from "@/components/shop/ShopItems";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function ShopDetail() {
  const { id } = useParams<{ id: string }>();
  const { shop, isShopLoading, refetchShop } = useShop();

  useEffect(() => {
    if (id) {
      refetchShop();
    }
  }, [id, refetchShop]);

  if (isShopLoading || !shop) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardContent className="p-0">
          {shop.image_url && (
            <div className="w-full h-48 overflow-hidden">
              <img
                src={shop.image_url}
                alt={shop.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <div className="bg-primary text-primary-foreground w-full h-full flex items-center justify-center text-xl font-bold">
                      {shop.name?.charAt(0) || "S"}
                    </div>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold">{shop.name}</h1>
                    <div className="flex items-center gap-2">
                      <Badge variant={shop.status === 'approved' ? 'success' : 'secondary'}>
                        {shop.status.charAt(0).toUpperCase() + shop.status.slice(1)}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-1">★</span>
                        <span>{shop.average_rating?.toFixed(1) || "No ratings"}</span>
                        {shop.rating_count && <span className="ml-1">({shop.rating_count})</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button className="flex items-center gap-2">
                <ShoppingCart size={18} />
                View Cart
              </Button>
            </div>
            
            <div className="mt-6 space-y-4">
              <p className="text-gray-700">{shop.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {shop.address && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} />
                    <span>{shop.address}</span>
                  </div>
                )}
                
                {shop.website && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Globe size={16} />
                    <a href={shop.website} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                      {shop.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                
                {shop.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={16} />
                    <span>{shop.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="items">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="items" className="mt-6">
          {shop.id && <ShopItems shopId={shop.id} />}
        </TabsContent>
        
        <TabsContent value="reviews" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <p>No reviews yet.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
