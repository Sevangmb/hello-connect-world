
import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface ShopLocation {
  id: string;
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
  address: string | null;
}

interface ShopMapProps {
  shops?: ShopLocation[];
  isLoading?: boolean;
  onShopSelect?: (shopId: string) => void;
}

const ShopMap: React.FC<ShopMapProps> = ({ 
  shops = [], 
  isLoading = false,
  onShopSelect
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  
  // Initialize map on component mount
  useEffect(() => {
    if (!mapContainer.current) return;
    
    // Use mapbox token directly since we're in client code
    try {
      mapboxgl.accessToken = 'pk.eyJ1IjoiZnJpbmciLCJhIjoiY2xnZndwYzdqMDk5YTNlcW13NWpjeTRsMyJ9.BMIXW_cQJu5_K6BPbNXTqQ';
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [2.3522, 48.8566], // Paris (default center)
        zoom: 11
      });
      
      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl(), 'top-right'
      );
      
      // Try to get user location
      navigator.geolocation.getCurrentPosition(
        position => {
          const { longitude, latitude } = position.coords;
          setUserLocation([longitude, latitude]);
          
          if (map.current) {
            map.current.flyTo({
              center: [longitude, latitude],
              zoom: 13
            });
            
            // Add user marker
            new mapboxgl.Marker({ color: '#0000FF' })
              .setLngLat([longitude, latitude])
              .setPopup(new mapboxgl.Popup().setHTML('<h3>Votre position</h3>'))
              .addTo(map.current);
          }
        },
        error => {
          console.warn('Error getting user location:', error);
        }
      );
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Une erreur est survenue lors de l\'initialisation de la carte');
    }
    
    return () => {
      // Clean up markers
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      
      // Clean up map
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);
  
  // Update markers when shops change
  useEffect(() => {
    if (!map.current || isLoading || shops.length === 0) return;
    
    // Clean up previous markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    
    // Add new markers for each shop
    shops.forEach(shop => {
      if (!shop.latitude || !shop.longitude) return;
      
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <h3 class="font-semibold text-sm">${shop.name}</h3>
        ${shop.address ? `<p class="text-xs mt-1">${shop.address}</p>` : ''}
        ${shop.description ? `<p class="text-xs text-gray-600 mt-1">${shop.description.substring(0, 100)}${shop.description.length > 100 ? '...' : ''}</p>` : ''}
        <button class="text-xs text-blue-500 mt-2 view-shop" data-shop-id="${shop.id}">Voir la boutique</button>
      `);
      
      const marker = new mapboxgl.Marker({ color: '#FF0000' })
        .setLngLat([shop.longitude, shop.latitude])
        .setPopup(popup)
        .addTo(map.current!);
      
      markers.current.push(marker);
    });
    
    // Add event listeners to popup buttons after they are added to the DOM
    document.addEventListener('click', (e) => {
      if (e.target instanceof HTMLElement && e.target.classList.contains('view-shop') && onShopSelect) {
        const shopId = e.target.getAttribute('data-shop-id');
        if (shopId) {
          onShopSelect(shopId);
        }
      }
    });
    
    // Fit map to bounds if there are markers
    if (markers.current.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      
      shops.forEach(shop => {
        if (shop.latitude && shop.longitude) {
          bounds.extend([shop.longitude, shop.latitude]);
        }
      });
      
      if (userLocation) {
        bounds.extend(userLocation);
      }
      
      map.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: 15
      });
    }
  }, [shops, isLoading, userLocation, onShopSelect]);
  
  if (mapError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 text-center">
        <p>{mapError}</p>
      </div>
    );
  }
  
  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-lg overflow-hidden border border-gray-200">
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default ShopMap;
