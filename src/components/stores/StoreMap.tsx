import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useStores } from "@/hooks/useStores";
import { Skeleton } from "@/components/ui/skeleton";
import "leaflet/dist/leaflet.css";

// Set up the default marker icon
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Default center coordinates (Paris)
const defaultCenter: [number, number] = [48.8566, 2.3522];

const StoreMap = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { stores, loading } = useStores();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || loading) {
    return (
      <div className="h-[600px] rounded-lg overflow-hidden bg-gray-100">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  const mapCenter = stores.length > 0 && stores[0].latitude && stores[0].longitude
    ? [stores[0].latitude, stores[0].longitude] as [number, number]
    : defaultCenter;

  return (
    <div className="h-[600px] rounded-lg overflow-hidden">
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        key={`${mapCenter[0]}-${mapCenter[1]}`}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {stores.map((store) => {
          if (!store.latitude || !store.longitude) return null;
          
          return (
            <Marker
              key={store.id}
              position={[store.latitude, store.longitude] as [number, number]}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold">{store.name}</h3>
                  {store.description && (
                    <p className="text-sm text-gray-600">{store.description}</p>
                  )}
                  {store.address && (
                    <p className="text-sm mt-1">{store.address}</p>
                  )}
                  {store.phone && (
                    <p className="text-sm mt-1">
                      <a href={`tel:${store.phone}`} className="text-blue-500 hover:underline">
                        {store.phone}
                      </a>
                    </p>
                  )}
                  {store.website && (
                    <p className="text-sm mt-1">
                      <a
                        href={store.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Visit Website
                      </a>
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default StoreMap;