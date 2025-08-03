import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Building2, 
  Users, 
  Phone, 
  Mail, 
  ExternalLink,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';

interface Office {
  id: string;
  name: string;
  nameEn: string;
  type: 'headquarters' | 'main-branch' | 'regional' | 'representative' | 'coordination' | 'european';
  country: string;
  city: string;
  coordinates: { lat: number; lng: number };
  established: string;
  employees: number;
  services: string[];
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  description: string;
  color: string;
  priority: number;
  achievements?: string[];
}

interface InteractiveMapProps {
  offices: Office[];
  selectedOffice: Office | null;
  onSelectOffice: (office: Office | null) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  offices, 
  selectedOffice, 
  onSelectOffice 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map when token is available
  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || map.current) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [45, 25], // Center on Middle East
        zoom: 2.5,
        projection: 'globe',
        attributionControl: false
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      // Add atmosphere and fog effects
      map.current.on('style.load', () => {
        if (map.current) {
          map.current.setFog({
            color: 'rgb(220, 230, 255)',
            'high-color': 'rgb(200, 220, 255)',
            'horizon-blend': 0.05,
            'space-color': 'rgb(11, 11, 25)',
            'star-intensity': 0.6
          });
          setMapLoaded(true);
        }
      });

      // Rotation animation
      let userInteracting = false;
      const secondsPerRevolution = 120;

      const spinGlobe = () => {
        if (!map.current || userInteracting) return;
        
        const center = map.current.getCenter();
        center.lng -= 360 / secondsPerRevolution;
        map.current.easeTo({ center, duration: 1000, easing: (n) => n });
      };

      // Set up rotation
      const rotationInterval = setInterval(spinGlobe, 1000);

      // Stop rotation on interaction
      map.current.on('mousedown', () => {
        userInteracting = true;
        clearInterval(rotationInterval);
      });

      map.current.on('mouseup', () => {
        userInteracting = false;
      });

      return () => {
        clearInterval(rotationInterval);
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, [mapboxToken]);

  // Add office markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    markers.forEach(marker => marker.remove());
    setMarkers([]);

    const newMarkers: mapboxgl.Marker[] = [];

    offices.forEach((office) => {
      // Create marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'office-marker';
      markerElement.style.cssText = `
        width: ${office.type === 'headquarters' ? '32px' : office.type === 'main-branch' ? '28px' : '24px'};
        height: ${office.type === 'headquarters' ? '32px' : office.type === 'main-branch' ? '28px' : '24px'};
        background: ${office.color};
        border: 3px solid white;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
        position: relative;
        z-index: 1;
      `;

      // Add hover effects
      markerElement.addEventListener('mouseenter', () => {
        markerElement.style.transform = 'scale(1.2)';
        markerElement.style.zIndex = '2';
      });

      markerElement.addEventListener('mouseleave', () => {
        if (selectedOffice?.id !== office.id) {
          markerElement.style.transform = 'scale(1)';
          markerElement.style.zIndex = '1';
        }
      });

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: false,
        className: 'custom-popup'
      }).setHTML(`
        <div class="p-3 min-w-64">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-3 h-3 rounded-full" style="background: ${office.color}"></div>
            <h3 class="font-bold text-sm">${office.name}</h3>
          </div>
          <p class="text-xs text-gray-600 mb-2">${office.country}</p>
          <div class="flex items-center gap-4 text-xs text-gray-500">
            <span class="flex items-center gap-1">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              ${office.established}
            </span>
            <span class="flex items-center gap-1">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
              </svg>
              ${office.employees} موظف
            </span>
          </div>
        </div>
      `);

      // Create marker
      const marker = new mapboxgl.Marker(markerElement, {
        anchor: 'bottom'
      })
        .setLngLat([office.coordinates.lng, office.coordinates.lat])
        .setPopup(popup)
        .addTo(map.current);

      // Add click handler
      markerElement.addEventListener('click', () => {
        onSelectOffice(office);
        map.current?.flyTo({
          center: [office.coordinates.lng, office.coordinates.lat],
          zoom: 8,
          duration: 2000
        });
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);
  }, [offices, onSelectOffice, mapLoaded]);

  // Handle selected office
  useEffect(() => {
    if (!selectedOffice || !map.current) return;

    // Update marker styles
    markers.forEach((marker, index) => {
      const office = offices[index];
      const element = marker.getElement();
      if (office.id === selectedOffice.id) {
        element.style.transform = 'scale(1.3)';
        element.style.zIndex = '3';
        element.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
      } else {
        element.style.transform = 'scale(1)';
        element.style.zIndex = '1';
        element.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
      }
    });
  }, [selectedOffice, markers, offices]);

  if (!mapboxToken) {
    return (
      <Card className="h-96 bg-gradient-to-br from-blue-50 to-indigo-100">
        <CardContent className="p-8 h-full flex flex-col justify-center items-center">
          <div className="text-center mb-8">
            <MapPin className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">خريطة تفاعلية</h3>
            <p className="text-gray-600 mb-6">
              للاستمتاع بالخريطة التفاعلية، نحتاج إلى Mapbox API Key
            </p>
            
            {!showTokenInput ? (
              <Button 
                onClick={() => setShowTokenInput(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Settings className="w-4 h-4 mr-2" />
                إعداد الخريطة
              </Button>
            ) : (
              <div className="max-w-md mx-auto space-y-4">
                <div>
                  <Label htmlFor="mapbox-token" className="text-sm font-medium">
                    Mapbox Public Token
                  </Label>
                  <Input
                    id="mapbox-token"
                    type="password"
                    placeholder="pk.ey..."
                    value={mapboxToken}
                    onChange={(e) => setMapboxToken(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    يمكنك الحصول على API Key مجاناً من 
                    <a 
                      href="https://mapbox.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline mx-1"
                    >
                      Mapbox
                      <ExternalLink className="w-3 h-3 inline mr-1" />
                    </a>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setShowTokenInput(false)}
                    variant="outline"
                    size="sm"
                  >
                    إلغاء
                  </Button>
                  <Button 
                    onClick={() => setMapboxToken(mapboxToken)}
                    disabled={!mapboxToken.startsWith('pk.')}
                    size="sm"
                  >
                    تفعيل الخريطة
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Alternative Static View */}
          <div className="w-full h-48 bg-white/50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Building2 className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">معاينة ثابتة للمكاتب</p>
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {offices.slice(0, 3).map((office) => (
                  <Badge 
                    key={office.id} 
                    variant="outline" 
                    className="text-xs"
                    style={{ borderColor: office.color }}
                  >
                    <div 
                      className="w-2 h-2 rounded-full mr-1" 
                      style={{ backgroundColor: office.color }}
                    />
                    {office.city}
                  </Badge>
                ))}
                {offices.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{offices.length - 3} أخرى
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative">
      <div 
        ref={mapContainer} 
        className="w-full h-96 rounded-xl overflow-hidden shadow-2xl border border-gray-200"
      />
      
      {/* Map Controls */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setMapboxToken('');
            setShowTokenInput(false);
          }}
          className="text-xs"
        >
          <Settings className="w-3 h-3 mr-1" />
          إعادة تعيين
        </Button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-xs">
        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          دليل المكاتب
        </h4>
        <div className="space-y-1">
          {offices.slice(0, 4).map((office) => (
            <div key={office.id} className="flex items-center gap-2 text-xs">
              <div 
                className="w-3 h-3 rounded-full border border-white shadow-sm" 
                style={{ backgroundColor: office.color }}
              />
              <span className="truncate">{office.city}</span>
            </div>
          ))}
          {offices.length > 4 && (
            <div className="text-xs text-gray-500 mt-1">
              +{offices.length - 4} مكتب آخر
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;