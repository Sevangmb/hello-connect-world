import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { Store } from "@/hooks/useStores";
import { Button } from "@/components/ui/button";
import { Heart, Navigation2 } from "lucide-react";
import "leaflet/dist/leaflet.css";

interface StoreMapProps {
  stores: Store[];
  favorites: string[];
  onToggleFavorite: (storeId: string) => void;
}

const customIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export function StoreMap({ stores, favorites, onToggleFavorite }: StoreMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const calculateRoute = (shopLatLng: [number, number]) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${shopLatLng[0]},${shopLatLng[1]}`,
      '_blank'
    );
  };

  if (!mounted) return null;

  // Find map center based on stores or use Paris as default
  const defaultCenter: [number, number] = [48.8566, 2.3522];
  const mapCenter = stores.length > 0 
    ? [stores[0].latitude, stores[0].longitude] as [number, number]
    : defaultCenter;

  return (
    <div className="h-[600px] rounded-lg overflow-hidden">
      <MapContainer
        center={mapCenter}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {stores.map((store) => (
          <Marker
            key={store.id}
            position={[store.latitude, store.longitude]}
            icon={customIcon}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold">{store.name}</h3>
                {store.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {store.description}
                  </p>
                )}
                {store.address && (
                  <p className="text-sm mt-2">{store.address}</p>
                )}
                {store.average_rating && (
                  <p className="text-sm mt-1">
                    Note: {store.average_rating.toFixed(1)}/5
                  </p>
                )}
                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onToggleFavorite(store.id)}
                  >
                    <Heart
                      className={`h-4 w-4 mr-2 ${
                        favorites.includes(store.id)
                          ? "fill-current text-red-500"
                          : ""
                      }`}
                    />
                    {favorites.includes(store.id)
                      ? "Retirer des favoris"
                      : "Ajouter aux favoris"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      calculateRoute([store.latitude, store.longitude])
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
    </div>
  );
}