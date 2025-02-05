import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useStores } from "@/hooks/useStores";
import "leaflet/dist/leaflet.css";
import { useToast } from "@/hooks/use-toast";

// Default center coordinates (Paris)
const defaultCenter: [number, number] = [48.8566, 2.3522];

const StoreMap = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { stores, loading } = useStores();
  const { toast } = useToast();

  useEffect(() => {
    let mapRoot: any = null;

    const initializeMap = async () => {
      try {
        console.log("Starting map initialization...");
        
        // Import Leaflet and React-Leaflet dynamically
        const L = (await import("leaflet")).default;
        const { MapContainer, TileLayer, Marker, Popup } = await import("react-leaflet");

        console.log("Libraries loaded successfully");

        // Set up the default marker icon
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        });

        // Calculate map center
        const validStores = stores.filter(store => store.latitude && store.longitude);
        console.log("Valid stores with coordinates:", validStores.length);

        const mapCenter = validStores.length > 0
          ? [validStores[0].latitude, validStores[0].longitude] as [number, number]
          : defaultCenter;

        console.log("Map center set to:", mapCenter);

        const MapComponent = () => (
          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {validStores.map((store) => (
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
            ))}
          </MapContainer>
        );

        // Clean up existing map container
        const mapDiv = document.getElementById('map-container');
        if (!mapDiv) {
          console.error("Map container element not found");
          toast({
            title: "Erreur",
            description: "Impossible d'initialiser la carte",
            variant: "destructive",
          });
          return;
        }

        // Clear previous content
        while (mapDiv.firstChild) {
          mapDiv.removeChild(mapDiv.firstChild);
        }

        // Create new root and render map
        mapRoot = createRoot(mapDiv);
        mapRoot.render(<MapComponent />);
        setIsMounted(true);
        console.log("Map mounted successfully");

      } catch (error) {
        console.error("Error initializing map:", error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'initialisation de la carte",
          variant: "destructive",
        });
      }
    };

    if (!isMounted && !loading) {
      console.log("Attempting to initialize map, loading state:", loading);
      initializeMap();
    }

    // Cleanup function
    return () => {
      if (mapRoot) {
        mapRoot.unmount();
      }
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