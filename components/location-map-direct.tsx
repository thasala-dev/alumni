"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { MapPin, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProvincePositions } from "@/data/thailand-province";

interface LocationMapProps {
  latitude?: string | number;
  longitude?: string | number;
  onLocationChange?: (
    lat: number,
    lng: number,
    provinceCode?: string,
    provinceName?: string
  ) => void;
  height?: string;
  interactive?: boolean;
}

export default function LocationMap({
  latitude,
  longitude,
  onLocationChange,
  height = "300px",
  interactive = true,
}: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [position, setPosition] = useState<[number, number]>([
    13.7563,
    100.5018, // Default to Bangkok
  ]);
  const [marker, setMarker] = useState<[number, number] | null>(null);
  const [leaflet, setLeaflet] = useState<any>(null);
  const [selectedProvince, setSelectedProvince] = useState<string>("");

  // Function to find nearest province
  const findNearestProvince = useCallback((lat: number, lng: number) => {
    let minDistance = Infinity;
    let nearestProvinceCode = "";
    let nearestProvinceName = "";

    Object.entries(ProvincePositions).forEach(([code, province]) => {
      const [provinceLng, provinceLat] = province.coordinates;
      const distance = Math.sqrt(
        Math.pow(lat - provinceLat, 2) + Math.pow(lng - provinceLng, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestProvinceCode = code;
        nearestProvinceName = province.name;
      }
    });

    return { code: nearestProvinceCode, name: nearestProvinceName };
  }, []);

  // Function to get address from coordinates using reverse geocoding
  const reverseGeocode = useCallback(
    async (lat: number, lng: number) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=th,en`
        );
        const data = await response.json();

        if (data && data.address) {
          const province = data.address.state || data.address.province || "";
          const district =
            data.address.county || data.address.city_district || "";
          const subdistrict = data.address.suburb || data.address.village || "";

          // Find province code from name
          let provinceCode = "";
          Object.entries(ProvincePositions).forEach(([code, provinceData]) => {
            if (
              provinceData.name === province ||
              provinceData.name_eng.toLowerCase() === province.toLowerCase() ||
              province.includes(provinceData.name) ||
              province
                .toLowerCase()
                .includes(provinceData.name_eng.toLowerCase())
            ) {
              provinceCode = code;
            }
          });

          return {
            province,
            provinceCode,
            district,
            subdistrict,
            fullAddress: data.display_name,
          };
        }
      } catch (error) {
        console.error("Reverse geocoding error:", error);
      }

      // Fallback to nearest province calculation
      const nearestProvince = findNearestProvince(lat, lng);
      return {
        province: nearestProvince.name,
        provinceCode: nearestProvince.code,
        district: "",
        subdistrict: "",
        fullAddress: "",
      };
    },
    [findNearestProvince]
  );

  // Cleanup function
  const cleanup = useCallback(() => {
    try {
      // Clear markers
      if (markersRef.current) {
        markersRef.current.forEach((marker) => {
          if (marker && marker.remove) {
            marker.remove();
          }
        });
        markersRef.current = [];
      }

      // Remove map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off();
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Clear DOM
      if (mapRef.current) {
        mapRef.current.innerHTML = "";
        delete (mapRef.current as any)._leaflet_id;
      }

      setMapReady(false);
    } catch (error) {
      console.error("Cleanup error:", error);
    }
  }, []);

  // Load Leaflet dynamically
  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        const L = await import("leaflet");

        // Fix default markers using CDN
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
          iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        });

        // Custom green marker for work location
        (L as any).customMarkerIcon = L.divIcon({
          html: `
            <div style="
              background-color: #81B214;
              width: 25px;
              height: 25px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              border: 3px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              position: relative;
            ">
              <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(45deg);
                color: white;
                font-size: 12px;
                font-weight: bold;
              ">📍</div>
            </div>
          `,
          className: "custom-div-icon",
          iconSize: [25, 25],
          iconAnchor: [12, 25],
          popupAnchor: [0, -25],
        });

        setLeaflet(L);
        setMounted(true);
      } catch (error) {
        console.error("Error loading Leaflet:", error);
      }
    };

    loadLeaflet();

    return cleanup;
  }, [cleanup]);

  // Initialize map
  useEffect(() => {
    if (!mounted || !leaflet || !mapRef.current || mapInstanceRef.current)
      return;

    try {
      // Clear any existing content
      if (mapRef.current) {
        mapRef.current.innerHTML = "";
        delete (mapRef.current as any)._leaflet_id;
      }

      const map = leaflet.map(mapRef.current, {
        center: position,
        zoom: marker ? 13 : 6,
        zoomControl: true,
        scrollWheelZoom: true,
        attributionControl: false, // Disable attribution to prevent errors
      });

      // Add tile layer
      leaflet
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; PharmWuAlumni",
        })
        .addTo(map);

      // Add click handler if interactive
      if (interactive) {
        map.on("click", async (e: any) => {
          const { lat, lng } = e.latlng;
          setMarker([lat, lng]);

          // Get province information
          const locationInfo = await reverseGeocode(lat, lng);
          setSelectedProvince(locationInfo.province);

          onLocationChange?.(
            lat,
            lng,
            locationInfo.provinceCode,
            locationInfo.province
          );
        });
      }

      mapInstanceRef.current = map;
    } catch (error) {
      console.error("Error initializing map:", error);
    }

    // Cleanup function
    return () => {
      try {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.off(); // Remove all event listeners
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
        if (mapRef.current) {
          mapRef.current.innerHTML = "";
          delete (mapRef.current as any)._leaflet_id;
        }
      } catch (error) {
        console.error("Error cleaning up map:", error);
      }
    };
  }, [mounted, leaflet, position, interactive, onLocationChange]);

  // Update marker when coordinates change
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

  // Update map marker
  useEffect(() => {
    if (!mapInstanceRef.current || !leaflet || !marker) return;

    try {
      // Clear existing markers safely
      const layersToRemove: any[] = [];
      mapInstanceRef.current.eachLayer((layer: any) => {
        if (layer instanceof leaflet.Marker) {
          layersToRemove.push(layer);
        }
      });

      layersToRemove.forEach((layer) => {
        mapInstanceRef.current.removeLayer(layer);
      });

      // Add new marker with custom icon
      const markerInstance = leaflet
        .marker(marker, {
          icon: (leaflet as any).customMarkerIcon,
        })
        .addTo(mapInstanceRef.current);

      markerInstance.bindPopup(`
        <div style="text-align: center; padding: 8px;">
          <div style="font-weight: bold; margin-bottom: 4px; color: #81B214;">
            📍 ตำแหน่งที่ทำงาน
          </div>
          ${
            selectedProvince
              ? `
            <div style="font-size: 13px; color: #333; margin-bottom: 4px; font-weight: 500;">
              จังหวัด${selectedProvince}
            </div>
          `
              : ""
          }
          <div style="font-size: 12px; color: #666; margin-bottom: 4px;">
            ${marker[0].toFixed(6)}, ${marker[1].toFixed(6)}
          </div>
          <div style="font-size: 10px; color: #999;">
            คลิกบนแผนที่เพื่อเปลี่ยนตำแหน่ง
          </div>
        </div>
      `);

      // Pan to marker
      mapInstanceRef.current.setView(marker, 13);
    } catch (error) {
      console.error("Error updating marker:", error);
    }
  }, [marker, leaflet]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setPosition([lat, lng]);
          setMarker([lat, lng]);

          // Get province information
          const locationInfo = await reverseGeocode(lat, lng);
          setSelectedProvince(locationInfo.province);

          onLocationChange?.(
            lat,
            lng,
            locationInfo.provinceCode,
            locationInfo.province
          );

          if (
            mapInstanceRef.current &&
            !(mapInstanceRef.current._container as any)._leaflet_id
          ) {
            try {
              mapInstanceRef.current.setView([lat, lng], 13);
            } catch (error) {
              console.error("Error setting map view:", error);
            }
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

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
        ref={mapRef}
        className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 w-full"
        style={{ height }}
      />

      {marker && (
        <div className="space-y-1">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            พิกัด: {marker[0].toFixed(6)}, {marker[1].toFixed(6)}
          </div>
          {selectedProvince && (
            <div className="text-sm text-center font-medium text-green-600 dark:text-green-400">
              📍 {selectedProvince}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
