
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { Store as ShopType } from "@/hooks/useStores";
import "leaflet/dist/leaflet.css";

interface StoreMapProps {
  stores?: ShopType[];
  isLoading?: boolean;
}

export default function StoreMap({ stores = [], isLoading = false }: StoreMapProps) {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  
  useEffect(() => {
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);
  
  // Filter out stores without coordinates
  const storesWithCoordinates = stores.filter(
    store => store.latitude && store.longitude
  );
  
  // Default center to Paris if no user location and no stores with coordinates
  const mapCenter = userLocation || 
    (storesWithCoordinates.length > 0 
      ? [storesWithCoordinates[0].latitude, storesWithCoordinates[0].longitude] 
      : [48.8566, 2.3522]);
  
  // Create custom icon for stores
  const storeIcon = new Icon({
    iconUrl: "https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-center p-6">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  if (!isLoading && storesWithCoordinates.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-center p-6">
          <Store className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucune boutique à afficher</h3>
          <p className="text-muted-foreground mb-4">
            Aucune boutique avec des coordonnées n'a été trouvée. Essayez de modifier vos filtres.
          </p>
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      center={mapCenter as [number, number]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* User location marker */}
      {userLocation && (
        <Marker 
          position={userLocation}
          icon={new Icon({
            iconUrl: "https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            className: "text-blue-500"
          })}
        >
          <Popup>
            <div className="text-center p-2">
              <p className="font-medium">Votre position</p>
            </div>
          </Popup>
        </Marker>
      )}
      
      {/* Store markers */}
      {storesWithCoordinates.map((store) => (
        <Marker
          key={store.id}
          position={[store.latitude, store.longitude] as [number, number]}
          icon={storeIcon}
        >
          <Popup>
            <div className="p-1">
              <h3 className="font-medium text-lg">{store.name}</h3>
              {store.description && (
                <p className="text-sm text-muted-foreground my-1">
                  {store.description.substring(0, 100)}
                  {store.description.length > 100 ? "..." : ""}
                </p>
              )}
              
              {store.categories && store.categories.length > 0 && (
                <div className="flex flex-wrap gap-1 my-2">
                  {store.categories.slice(0, 3).map((category, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                </div>
              )}
              
              <Button 
                className="w-full mt-2" 
                size="sm"
                onClick={() => navigate(`/shops/${store.id}`)}
              >
                Voir la boutique
              </Button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
