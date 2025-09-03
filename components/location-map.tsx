"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { MapPin, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

// Dynamic import for Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

interface LocationMapProps {
  latitude?: string | number;
  longitude?: string | number;
  onLocationChange?: (lat: number, lng: number) => void;
  height?: string;
  interactive?: boolean;
}

// Simple click handler component
function MapClickHandler({
  onLocationChange,
}: {
  onLocationChange?: (lat: number, lng: number) => void;
}) {
  const [MapEvents, setMapEvents] = useState<any>(null);

  useEffect(() => {
    import("react-leaflet").then((mod) => {
      setMapEvents(() => mod.useMapEvents);
    });
  }, []);

  if (!MapEvents) return null;

  return (
    <MapClickComponent
      MapEvents={MapEvents}
      onLocationChange={onLocationChange}
    />
  );
}

function MapClickComponent({
  MapEvents,
  onLocationChange,
}: {
  MapEvents: any;
  onLocationChange?: (lat: number, lng: number) => void;
}) {
  MapEvents({
    click: (e: any) => {
      const { lat, lng } = e.latlng;
      onLocationChange?.(lat, lng);
    },
  });
  return null;
}

export default function LocationMap({
  latitude,
  longitude,
  onLocationChange,
  height = "300px",
  interactive = true,
}: LocationMapProps) {
  const [mounted, setMounted] = useState(false);
  const [mapKey, setMapKey] = useState(0);
  const [position, setPosition] = useState<[number, number]>([
    13.7563,
    100.5018, // Default to Bangkok
  ]);
  const [marker, setMarker] = useState<[number, number] | null>(null);
  const mapRef = useRef<any>(null);

  // Force remount when props change significantly
  useEffect(() => {
    setMapKey((prev) => prev + 1);
  }, [interactive]);

  useEffect(() => {
    setMounted(true);

    // Cleanup function to prevent memory leaks
    return () => {
      setMounted(false);
      if (mapRef.current) {
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      const lat =
        typeof latitude === "string" ? parseFloat(latitude) : latitude;
      const lng =
        typeof longitude === "string" ? parseFloat(longitude) : longitude;

      if (!isNaN(lat) && !isNaN(lng)) {
        setPosition([lat, lng]);
        setMarker([lat, lng]);
      }
    }
  }, [latitude, longitude]);

  const handleLocationChange = useCallback(
    (lat: number, lng: number) => {
      if (!interactive) return;

      setMarker([lat, lng]);
      onLocationChange?.(lat, lng);
    },
    [interactive, onLocationChange]
  );

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setPosition([lat, lng]);
          setMarker([lat, lng]);
          onLocationChange?.(lat, lng);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, [onLocationChange]);

  if (!mounted) {
    return (
      <div
        className="bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-gray-500 dark:text-gray-400">
          กำลังโหลดแผนที่...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {interactive && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            คลิกบนแผนที่เพื่อปักหมุดตำแหน่งที่ทำงาน
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={getCurrentLocation}
            className="flex items-center gap-2"
          >
            <Target className="h-4 w-4" />
            ตำแหน่งปัจจุบัน
          </Button>
        </div>
      )}

      <div
        className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
        style={{ height }}
        key={mapKey} // Force remount with key
      >
        <MapContainer
          key={`map-${mapKey}`} // Additional key for MapContainer
          center={position}
          zoom={marker ? 13 : 6}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {interactive && (
            <MapClickHandler onLocationChange={handleLocationChange} />
          )}

          {marker && (
            <Marker position={marker}>
              <Popup>
                <div className="text-center">
                  <MapPin className="h-5 w-5 mx-auto mb-1 text-[#81B214]" />
                  <div className="font-semibold">ตำแหน่งที่ทำงาน</div>
                  <div className="text-xs text-gray-500">
                    {marker[0].toFixed(6)}, {marker[1].toFixed(6)}
                  </div>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {marker && (
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          พิกัด: {marker[0].toFixed(6)}, {marker[1].toFixed(6)}
        </div>
      )}
    </div>
  );
}
