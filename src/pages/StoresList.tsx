import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, MapPin, Phone, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function StoresList() {
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Liste des Boutiques</h1>
          </div>

          {loading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {shops.map((shop) => (
                <Card key={shop.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{shop.name}</span>
                      <ShoppingBag className="h-5 w-5 text-gray-400" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-4">{shop.description}</p>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>Adresse à venir</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>Contact à venir</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Globe className="h-4 w-4" />
                        <span>Site web à venir</span>
                      </div>
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
              ))}
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}