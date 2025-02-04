import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useStores } from "@/hooks/useStores";

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const StoreMap = () => {
  const [mounted, setMounted] = useState(false);
  const { stores, loading } = useStores();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-[600px] rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
        <p>Loading map...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-[600px] rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
        <p>Loading stores...</p>
      </div>
    );
  }

  // Find map center based on stores or use Paris as default
  const defaultCenter: [number, number] = [48.8566, 2.3522];
  const mapCenter = stores.length > 0 && stores[0].latitude && stores[0].longitude
    ? [stores[0].latitude, stores[0].longitude] as [number, number]
    : defaultCenter;

  return (
    <div className="h-[600px] rounded-lg overflow-hidden">
      <MapContainer
        key={mounted ? "mounted" : "unmounted"}
        center={mapCenter}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
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