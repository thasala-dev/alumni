"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet" // Import Leaflet library for icon customization
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"

// Fix for default Leaflet icon issue with Webpack/Next.js
// This ensures the default marker icons are displayed correctly
delete L.Icon.Default.prototype._get // Remove the problematic _getIconUrl method
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "leaflet/images/marker-icon-2x.png",
  iconUrl: "leaflet/images/marker-icon.png",
  shadowUrl: "leaflet/images/marker-shadow.png",
})

interface ProvinceData {
  province: string
  count: number
  coordinates: [number, number] // [longitude, latitude]
}

// Simplified demo data with approximate coordinates for a few provinces in Thailand
const demoProvinceDataWithCoords: ProvinceData[] = [
  { province: "กรุงเทพมหานคร", count: 342, coordinates: [13.7563, 100.5018] }, // Leaflet uses [latitude, longitude]
  { province: "เชียงใหม่", count: 156, coordinates: [18.7883, 98.9893] },
  { province: "ขอนแก่น", count: 98, coordinates: [16.4325, 102.8358] },
  { province: "สงขลา", count: 87, coordinates: [7.2, 100.5955] },
  { province: "ชลบุรี", count: 76, coordinates: [13.36, 100.9883] },
  { province: "ภูเก็ต", count: 50, coordinates: [7.8804, 98.3923] },
  { province: "นครราชสีมา", count: 45, coordinates: [14.975, 102.0833] },
  { province: "ระยอง", count: 30, coordinates: [12.6767, 101.2186] },
]

export function MapOverview() {
  // Center of Thailand for the map
  const thailandCenter: [number, number] = [13.736717, 100.523186] // Approximate center of Thailand (latitude, longitude)
  const initialZoom = 6 // Initial zoom level

  return (
    <Card className="h-full shadow-md rounded-xl">
      {" "}
      {/* Added shadow and rounded corners */}
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-semibold">
          {" "}
          {/* Larger, bolder title */}
          <MapPin className="mr-2 h-5 w-5 text-blue-600" /> {/* Added text color to icon */}
          แผนที่การกระจายตัวศิษย์เก่า
        </CardTitle>
        <CardDescription className="text-gray-600">แสดงการกระจายตัวของศิษย์เก่าตามจังหวัดที่ทำงาน (ข้อมูลตัวอย่าง)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[400px] rounded-lg overflow-hidden relative z-0">
          {" "}
          {/* Added z-0 to prevent tooltip issues */}
          <MapContainer center={thailandCenter} zoom={initialZoom} scrollWheelZoom={false} className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {demoProvinceDataWithCoords.map(({ province, count, coordinates }) => (
              <Marker key={province} position={coordinates}>
                <Popup>
                  <div className="font-semibold">{province}</div>
                  <div>{count} คน</div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          <div className="absolute bottom-4 left-4 text-xs text-gray-500 bg-white/80 p-2 rounded-md shadow-sm">
            *แผนที่นี้เป็นเพียงตัวอย่าง
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
