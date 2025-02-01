import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, MapPin, Phone, Globe, Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function StoresList() {
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      console.log("Fetching stores list...");
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("No user found");
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour voir la liste des boutiques",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles:user_id (username),
          shop_items (
            id
          )
        `)
        .eq('status', 'approved');

      if (error) {
        console.error('Error fetching stores:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la liste des boutiques",
          variant: "destructive",
        });
        return;
      }

      console.log("Stores fetched:", data);
      setShops(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <MainSidebar />
      
      <main className="pt-20 px-4 md:pl-72 pb-16 md:pb-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Boutiques</h1>
              <p className="text-muted-foreground mt-1">
                Découvrez notre sélection de boutiques
              </p>
            </div>
            <Button onClick={() => navigate("/shops/create")} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Ouvrir ma boutique
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !shops.length ? (
            <Card className="bg-muted/50">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune boutique</h3>
                <p className="text-muted-foreground mb-4">
                  Soyez le premier à ouvrir une boutique !
                </p>
                <Button onClick={() => navigate("/shops/create")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ouvrir ma boutique
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {shops.map((shop) => (
                <Card key={shop.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{shop.name}</CardTitle>
                        <CardDescription className="mt-1.5">
                          Par {shop.profiles?.username || 'Inconnu'}
                        </CardDescription>
                      </div>
                      <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {shop.description && (
                      <p className="text-sm text-muted-foreground mb-4">
                        {shop.description}
                      </p>
                    )}
                    
                    <div className="space-y-3">
                      {shop.address && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{shop.address}</span>
                        </div>
                      )}
                      {shop.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{shop.phone}</span>
                        </div>
                      )}
                      {shop.website && (
                        <div className="flex items-center gap-2 text-sm">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <a 
                            href={shop.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {shop.website}
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      <Badge variant="secondary" className="text-xs">
                        {shop.shop_items?.length || 0} articles
                      </Badge>
                      {shop.average_rating > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {shop.average_rating} / 5
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}