import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useStores } from "@/hooks/useStores";
import "leaflet/dist/leaflet.css";
import { useToast } from "@/hooks/use-toast";

// Centre de la France
const FRANCE_CENTER: [number, number] = [46.603354, 1.888334];
const DEFAULT_ZOOM = 6;

const StoreMap = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { stores, loading } = useStores();
  const { toast } = useToast();

  useEffect(() => {
    let mapRoot: any = null;

    const initializeMap = async () => {
      try {
        console.log("Starting map initialization...");
        
        const L = (await import("leaflet")).default;
        const { MapContainer, TileLayer, Marker, Popup } = await import("react-leaflet");

        console.log("Libraries loaded successfully");

        // Configuration de l'icône par défaut
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        });

        // Filtrer les magasins avec des coordonnées valides
        const validStores = stores.filter(store => 
          store.latitude && 
          store.longitude && 
          !isNaN(store.latitude) && 
          !isNaN(store.longitude)
        );
        
        console.log("Valid stores with coordinates:", validStores.length);

        const MapComponent = () => (
          <MapContainer
            center={FRANCE_CENTER}
            zoom={DEFAULT_ZOOM}
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
                position={[store.latitude!, store.longitude!] as [number, number]}
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
                          Visiter le site web
                        </a>
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        );

        const mapDiv = document.getElementById('map-container');
        if (!mapDiv) {
          console.error("Map container element not found");
          return;
        }

        // Nettoyer le conteneur existant
        while (mapDiv.firstChild) {
          mapDiv.removeChild(mapDiv.firstChild);
        }

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

    return () => {
      if (mapRoot) {
        mapRoot.unmount();
      }
      setIsMounted(false);
    };
  }, [stores, loading, isMounted, toast]);

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