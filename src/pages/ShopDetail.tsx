
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Phone, Globe, ShoppingBag, Pencil, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageLayout } from "@/components/layouts/PageLayout";
import { ShopItems } from "@/components/shop/ShopItems";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function ShopDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: shop, isLoading } = useQuery({
    queryKey: ["shop", id],
    queryFn: async () => {
      console.log("Fetching shop details for:", id);
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("shops")
        .select(`
          *,
          profiles:user_id (username, full_name),
          shop_items!shop_items_shop_id_fkey (
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

  const isOwner = user?.id === shop?.user_id;

  if (isLoading) {
    return (
      <PageLayout>
        <div className="text-center py-8">Chargement...</div>
      </PageLayout>
    );
  }

  if (!shop) {
    return (
      <PageLayout>
        <div className="text-center py-8">
          Boutique introuvable
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">{shop.name}</h1>
                    <p className="text-gray-600 mb-4">{shop.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Badge variant="secondary">
                        <ShoppingBag className="h-3 w-3 mr-1" />
                        {shop.shop_items?.length || 0} articles
                      </Badge>
                      {shop.average_rating > 0 && (
                        <Badge variant="outline">
                          ⭐️ {shop.average_rating.toFixed(1)}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {isOwner && (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/shops/${id}/edit`)}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => navigate(`/shops/${id}/clothes/new`)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter un article
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
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
              </div>
            </div>

            <Tabs defaultValue="articles" className="mt-6">
              <TabsList className="w-full justify-start border-b">
                <TabsTrigger value="articles" className="flex-1 md:flex-none">
                  Articles ({shop.shop_items?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="about" className="flex-1 md:flex-none">
                  À propos
                </TabsTrigger>
                <TabsTrigger value="reviews" className="flex-1 md:flex-none">
                  Avis
                </TabsTrigger>
              </TabsList>

              <TabsContent value="articles" className="mt-6">
                {shop && <ShopItems shopId={shop.id} />}
              </TabsContent>

              <TabsContent value="about" className="mt-6 space-y-4">
                <h3 className="font-semibold text-lg">À propos de la boutique</h3>
                <p className="text-gray-600">{shop.description}</p>
                {shop.opening_hours && (
                  <div>
                    <h4 className="font-medium mb-2">Horaires d'ouverture</h4>
                    <pre className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                      {JSON.stringify(shop.opening_hours, null, 2)}
                    </pre>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <p className="text-gray-600">Les avis seront bientôt disponibles.</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
