import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Phone, Globe, ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { useClothes } from "@/hooks/useClothes";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

export default function ShopDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  const { data: shop } = useQuery({
    queryKey: ["shop", id],
    queryFn: async () => {
      console.log("Fetching shop details for:", id);
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("shops")
        .select(`
          *,
          profiles:user_id (username),
          shop_items (
            id
          )
        `)
        .eq("id", id)
        .single();
        
      if (error) {
        console.error("Error fetching shop:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails de la boutique",
          variant: "destructive",
        });
        throw error;
      }
      
      return data;
    },
    enabled: !!id,
  });

  const { data: clothes } = useClothes({ shopId: id, isForSale: true });

  if (!shop) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">{shop.name}</h1>
                <p className="text-gray-600">{shop.description}</p>
              </div>
              <Badge variant="secondary">
                {shop.shop_items?.length || 0} articles
              </Badge>
            </div>
            
            <div className="flex flex-col gap-2 mb-6">
              {shop.address && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{shop.address}</span>
                </div>
              )}
              {shop.phone && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{shop.phone}</span>
                </div>
              )}
              {shop.website && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Globe className="h-4 w-4" />
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

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {clothes?.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    {item.image_url && (
                      <img 
                        src={item.image_url} 
                        alt={item.name}
                        className="w-full h-48 object-cover rounded-md mb-4" 
                      />
                    )}
                    <h3 className="font-semibold mb-2">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <Badge>{item.category}</Badge>
                      <span className="font-semibold">{item.price}€</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
