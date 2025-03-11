
import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import MainSidebar from '@/components/MainSidebar';
import { BottomNav } from '@/components/navigation/BottomNav';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { NearbyShop, ShopStatus } from '@/types/messages';
import { useToast } from '@/hooks/use-toast';

const StoresList = () => {
  const [stores, setStores] = useState<NearbyShop[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('shops')
          .select('*');

        if (error) throw error;

        // Convert to NearbyShop with proper ShopStatus
        const formattedStores = (data || []).map((store: any) => ({
          ...store,
          status: store.status as ShopStatus
        }));

        setStores(formattedStores);
      } catch (error: any) {
        console.error('Error fetching stores:', error);
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible de charger les boutiques'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [toast]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Liste des Boutiques</h1>
          
          {loading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stores.map(store => (
                <Card key={store.id} className="p-4 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold">{store.name}</h3>
                  <p className="text-sm text-gray-500">{store.address}</p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default StoresList;
