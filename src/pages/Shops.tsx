import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Shops() {
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles:user_id (username),
          shop_items (
            id
          )
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching shops:', error);
        return;
      }

      setShops(data || []);
    } catch (error) {
      console.error('Error:', error);
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
            <h1 className="text-2xl font-bold">Boutiques</h1>
            <Button onClick={() => navigate("/shops/create")}>
              <Plus className="h-4 w-4 mr-2" />
              Ouvrir ma boutique
            </Button>
          </div>

          {loading ? (
            <div>Chargement...</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {shops.map((shop) => (
                <Card key={shop.id} className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => navigate(`/shops/${shop.id}`)}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{shop.name}</span>
                      <ShoppingBag className="h-5 w-5 text-gray-400" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-2">{shop.description}</p>
                    <div className="flex justify-between items-center">
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