
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { useStores } from "@/hooks/useStores";
import "leaflet/dist/leaflet.css";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_ZOOM = 13;
const FRANCE_CENTER: [number, number] = [46.603354, 1.888334];

const StoreMap = () => {
  const { stores, loading } = useStores();
  const { toast } = useToast();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    // Obtenir la position de l'utilisateur
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
          toast({
            title: "Erreur de localisation",
            description: "Impossible d'obtenir votre position. Affichage de la carte par défaut.",
            variant: "destructive",
          });
        }
      );
    }
  }, [toast]);

  useEffect(() => {
    let mapRoot: any = null;

    const initializeMap = async () => {
      try {
        console.log("Starting map initialization...");
        
        const L = (await import("leaflet")).default;
        const { MapContainer, TileLayer, Marker, Popup } = await import("react-leaflet");

        console.log("Libraries loaded successfully");

        // Configuration de l'icône par défaut
        const defaultIcon = L.icon({
          iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
          iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
          shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });

        L.Marker.prototype.options.icon = defaultIcon;

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
            center={userLocation || FRANCE_CENTER}
            zoom={userLocation ? DEFAULT_ZOOM : 6}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={true}
            className="z-10"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              className="map-tiles"
            />

            {/* Marqueur pour la position de l'utilisateur */}
            {userLocation && (
              <Marker position={userLocation}>
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold">Votre position</h3>
                  </div>
                </Popup>
              </Marker>
            )}

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

    if (!loading) {
      console.log("Attempting to initialize map, loading state:", loading);
      initializeMap();
    }

    return () => {
      if (mapRoot) {
        mapRoot.unmount();
      }
    };
  }, [stores, loading, toast, userLocation]);

  return (
    <div className="h-[600px] rounded-lg overflow-hidden relative">
      <div id="map-container" className="w-full h-full absolute inset-0" />
    </div>
  );
};

export default StoreMap;
