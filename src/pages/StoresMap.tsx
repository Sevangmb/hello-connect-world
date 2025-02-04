import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { Store, Filter, Navigation2, Heart } from "lucide-react";
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import "leaflet/dist/leaflet.css";

interface Shop {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  latitude: number;
  longitude: number;
  status: string;
  average_rating: number | null;
  opening_hours: any;
  categories: string[] | null;
}

interface FilterState {
  category: string;
  priceRange: string;
  style: string;
}

const customIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const StoresMap = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    priceRange: "all",
    style: "all",
  });
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const { toast } = useToast();

  const fetchShops = async () => {
    try {
      console.log("Fetching shops with filters:", filters);
      let query = supabase
        .from("shops")
        .select("*")
        .eq("status", "approved");

      if (filters.category !== "all") {
        query = query.contains("categories", [filters.category]);
      }

      const { data, error } = await query;

      if (error) throw error;
      console.log("Fetched shops:", data);
      setShops(data || []);
    } catch (error) {
      console.error("Error fetching shops:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les boutiques",
        variant: "destructive",
      });
    }
  };

  const fetchFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("favorite_shops")
        .select("shop_id")
        .eq("user_id", user.id);

      if (error) throw error;
      console.log("Fetched favorites:", data);
      setFavorites(data.map(fav => fav.shop_id));
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const toggleFavorite = async (shopId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour ajouter des favoris",
          variant: "destructive",
        });
        return;
      }

      if (favorites.includes(shopId)) {
        await supabase
          .from("favorite_shops")
          .delete()
          .eq("user_id", user.id)
          .eq("shop_id", shopId);
        setFavorites(favorites.filter(id => id !== shopId));
      } else {
        await supabase
          .from("favorite_shops")
          .insert([{ user_id: user.id, shop_id: shopId }]);
        setFavorites([...favorites, shopId]);
      }

      toast({
        title: "Succès",
        description: favorites.includes(shopId)
          ? "Boutique retirée des favoris"
          : "Boutique ajoutée aux favoris",
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier les favoris",
        variant: "destructive",
      });
    }
  };

  const calculateRoute = (shopLatLng: [number, number]) => {
    setDestination(shopLatLng);
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${shopLatLng[0]},${shopLatLng[1]}`,
      '_blank'
    );
  };

  useEffect(() => {
    console.log("Initial fetch of shops and favorites");
    fetchShops();
    fetchFavorites();
  }, []);

  useEffect(() => {
    console.log("Filters changed, fetching shops");
    fetchShops();
  }, [filters]);

  // Only render the map on the client side
  const MapComponent = () => {
    if (typeof window === 'undefined') return null;

    return (
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
            position={[shop.latitude, shop.longitude]}
            icon={customIcon}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold">{shop.name}</h3>
                {shop.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {shop.description}
                  </p>
                )}
                {shop.address && (
                  <p className="text-sm mt-2">{shop.address}</p>
                )}
                {shop.average_rating && (
                  <p className="text-sm mt-1">
                    Note: {shop.average_rating.toFixed(1)}/5
                  </p>
                )}
                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleFavorite(shop.id)}
                  >
                    <Heart
                      className={`h-4 w-4 mr-2 ${
                        favorites.includes(shop.id)
                          ? "fill-current text-red-500"
                          : ""
                      }`}
                    />
                    {favorites.includes(shop.id)
                      ? "Retirer des favoris"
                      : "Ajouter aux favoris"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      calculateRoute([shop.latitude, shop.longitude])
                    }
                  >
                    <Navigation2 className="h-4 w-4 mr-2" />
                    Itinéraire
                  </Button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    );
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Select
                value={filters.category}
                onValueChange={(value) =>
                  setFilters({ ...filters, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  <SelectItem value="homme">Homme</SelectItem>
                  <SelectItem value="femme">Femme</SelectItem>
                  <SelectItem value="enfant">Enfant</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.priceRange}
                onValueChange={(value) =>
                  setFilters({ ...filters, priceRange: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Gamme de prix" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les prix</SelectItem>
                  <SelectItem value="low">€ Économique</SelectItem>
                  <SelectItem value="medium">€€ Moyen</SelectItem>
                  <SelectItem value="high">€€€ Premium</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.style}
                onValueChange={(value) =>
                  setFilters({ ...filters, style: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les styles</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="chic">Chic</SelectItem>
                  <SelectItem value="sport">Sport</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="h-[600px] rounded-lg overflow-hidden">
              <MapComponent />
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default StoresMap;