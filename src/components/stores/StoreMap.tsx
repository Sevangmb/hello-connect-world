import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useStores } from "@/hooks/useStores";
import "leaflet/dist/leaflet.css";

// Default center coordinates (Paris)
const defaultCenter: [number, number] = [48.8566, 2.3522];

const StoreMap = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { stores, loading } = useStores();

  useEffect(() => {
    const initializeMap = async () => {
      try {
        const L = (await import("leaflet")).default;
        const { MapContainer, TileLayer, Marker, Popup } = await import("react-leaflet");

        // Set up the default marker icon
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        });

        const mapCenter = stores.length > 0 && stores[0].latitude && stores[0].longitude
          ? [stores[0].latitude, stores[0].longitude] as [number, number]
          : defaultCenter;

        const MapComponent = () => (
          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={false}
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
        );

        // Render the map
        const mapDiv = document.getElementById('map-container');
        if (mapDiv) {
          const root = ReactDOM.createRoot(mapDiv);
          root.render(<MapComponent />);
          setIsMounted(true);
        }
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    if (!isMounted && !loading) {
      initializeMap();
    }

    return () => {
      setIsMounted(false);
    };
  }, [stores, loading, isMounted]);

  if (loading || !isMounted) {
    return (
      <div className="h-[600px] rounded-lg overflow-hidden bg-gray-100">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  return (
    <div className="h-[600px] rounded-lg overflow-hidden">
      <div id="map-container" className="w-full h-full" />
    </div>
  );
};

export default StoreMap;