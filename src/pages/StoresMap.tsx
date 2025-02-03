import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

// Fix leaflet's default icon issues with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Helper function to calculate distance between two coordinates using Haversine formula
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in meters
}

// Component to update the map center dynamically
function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
}

interface Shop {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  lat: number;
  lng: number;
}

export default function StoresMap() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch user's current location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error fetching geolocation:", error);
          toast({
            title: "Localisation indisponible",
            description: "Nous ne pouvons pas accéder à votre position.",
            variant: "destructive",
          });
          setUserLocation(null);
        }
      );
    } else {
      toast({
        title: "Geolocation non supportée",
        description: "Votre navigateur ne supporte pas la géolocalisation.",
        variant: "destructive",
      });
      setUserLocation(null);
    }
  }, [toast]);

  // Fetch approved shops from Supabase and sort them by distance from the user
  useEffect(() => {
    async function fetchShops() {
      try {
        const { data, error } = await supabase
          .from("shops")
          .select("id, name, description, address, lat, lng")
          .eq("status", "approved");

        if (error) {
          console.error("Error fetching shops:", error);
          toast({
            title: "Erreur",
            description: "Impossible de charger les boutiques.",
            variant: "destructive",
          });
          return;
        }
        let shopList = (data as Shop[]) || [];
        if (userLocation) {
          shopList = shopList
            .filter(
              (shop) =>
                shop.lat !== null &&
                shop.lng !== null &&
                typeof shop.lat === "number" &&
                typeof shop.lng === "number"
            )
            .sort((a, b) => {
              const distA = getDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
              const distB = getDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
              return distA - distB;
            });
        }
        setShops(shopList);
      } catch (err) {
        console.error("Error fetching shops data:", err);
      } finally {
        setLoading(false);
      }
    }

    // Only fetch shops after we attempt to get the user's location (even if null)
    fetchShops();
  }, [userLocation, toast]);

  // If geolocation is not available, we can show a message instead of map
  if (!("geolocation" in navigator)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>La géolocalisation n'est pas supportée par votre navigateur.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  // Default center if user location is not available
  const center = userLocation ? [userLocation.lat, userLocation.lng] : [48.8566, 2.3522];

  return (
    <div className="min-h-screen">
      <MapContainer center={center} zoom={13} style={{ height: "100vh", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>Vous êtes ici</Popup>
          </Marker>
        )}
        {shops.map((shop) => (
          <Marker key={shop.id} position={[shop.lat, shop.lng]}>
            <Popup>
              <div>
                <h3 className="font-bold">{shop.name}</h3>
                {shop.address && <p>{shop.address}</p>}
                {shop.description && <p className="text-sm">{shop.description}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
        {userLocation && <Recenter lat={userLocation.lat} lng={userLocation.lng} />}
      </MapContainer>
    </div>
  );
}
