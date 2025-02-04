import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { Store } from "lucide-react";
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import "leaflet/dist/leaflet.css";

// Définir l'interface pour les boutiques
interface Shop {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  latitude?: number;
  longitude?: number;
  status: string;
  average_rating: number | null;
  opening_hours: any;
  categories: string[] | null;
}

export default function StoresMap() {
  const [shops, setShops] = useState<Shop[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const { data, error } = await supabase
        .from("shops")
        .select("*")
        .eq("status", "approved");

      if (error) throw error;

      // Pour le moment, on simule des coordonnées pour Paris
      const shopsWithCoords = data.map(shop => ({
        ...shop,
        latitude: 48.8566 + (Math.random() - 0.5) * 0.1,
        longitude: 2.3522 + (Math.random() - 0.5) * 0.1
      }));

      setShops(shopsWithCoords);
    } catch (error) {
      console.error("Erreur lors du chargement des boutiques:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les boutiques",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-2xl font-bold mb-4">Carte des Boutiques</h1>
            <p className="text-gray-600 mb-6">
              La carte des boutiques permet aux utilisateurs de FRING! de localiser 
              visuellement et de découvrir facilement les boutiques de prêt-à-porter 
              indépendantes partenaires à proximité de leur position ou dans une zone 
              géographique choisie.
            </p>
            
            <div className="h-[600px] rounded-lg overflow-hidden">
              <MapContainer
                center={[48.8566, 2.3522]}
                zoom={12}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {shops.map((shop) => (
                  <Marker
                    key={shop.id}
                    position={[shop.latitude || 48.8566, shop.longitude || 2.3522]}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-bold">{shop.name}</h3>
                        {shop.description && (
                          <p className="text-sm text-gray-600">{shop.description}</p>
                        )}
                        {shop.address && (
                          <p className="text-sm mt-2">{shop.address}</p>
                        )}
                        {shop.average_rating && (
                          <p className="text-sm mt-1">
                            Note: {shop.average_rating.toFixed(1)}/5
                          </p>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}