"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, BarChart3 } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
// Removed: import { supabase, isSupabaseConfigured } from "@/lib/supabase"

interface ProvinceData {
  province: string;
  count: number;
  alumni: Array<{
    name: string;
    position: string;
    company: string;
  }>;
}

// isDemoMode is now always true as we are using mock data
const isDemoMode = true;

// Demo data for provinces
const demoProvinceData: ProvinceData[] = [
  {
    province: "กรุงเทพมหานคร",
    count: 342,
    alumni: [
      {
        name: "สมชาย ใจดี",
        position: "Software Engineer",
        company: "บริษัท เทคโนโลยี จำกัด",
      },
      {
        name: "สุดา สวยงาม",
        position: "Product Manager",
        company: "บริษัท ดิจิทัล จำกัด",
      },
      {
        name: "สุภาพร ใจดี",
        position: "Content Creator",
        company: "สถานีโทรทัศน์",
      },
    ],
  },
  {
    province: "เชียงใหม่",
    count: 156,
    alumni: [
      {
        name: "มาลี สวยงาม",
        position: "Business Analyst",
        company: "บริษัท การเงิน จำกัด",
      },
    ],
  },
  {
    province: "ขอนแก่น",
    count: 98,
    alumni: [
      {
        name: "กมล ทำดี",
        position: "Marketing Manager",
        company: "บริษัท โฆษณา จำกัด",
      },
    ],
  },
  {
    province: "สงขลา",
    count: 87,
    alumni: [],
  },
  {
    province: "ชลบุรี",
    count: 76,
    alumni: [
      {
        name: "พรชัย มีสุข",
        position: "Project Engineer",
        company: "บริษัท ก่อสร้าง จำกัด",
      },
    ],
  },
  {
    province: "ภูเก็ต",
    count: 50,
    alumni: [],
  },
  {
    province: "นครราชสีมา",
    count: 45,
    alumni: [],
  },
  {
    province: "ระยอง",
    count: 30,
    alumni: [],
  },
];

export default function MapPage() {
  const [provinceData, setProvinceData] = useState<ProvinceData[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<ProvinceData | null>(
    null
  );
  const [loading, setLoading] = useState(true); // Start loading to simulate fetch

  useEffect(() => {
    // Simulate data fetching
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      setProvinceData(demoProvinceData.sort((a, b) => b.count - a.count));
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/4 mb-8"></div>{" "}
          {/* Larger placeholder for title */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-gray-200 rounded-xl"></div>{" "}
            {/* Rounded corners for skeleton cards */}
            <div className="h-96 bg-gray-200 rounded-xl"></div>{" "}
            {/* Rounded corners for skeleton cards */}
          </div>
        </div>
      </div>
    );
  }

  const totalAlumni = provinceData.reduce(
    (sum, province) => sum + province.count,
    0
  );

  return (
    <div className="space-y-8">
      {" "}
      {/* Increased overall spacing */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">
          แผนที่การกระจายตัว
        </h1>{" "}
        {/* Bolder title */}
        <p className="text-lg text-gray-600">
          การกระจายตัวของศิษย์เก่าตามจังหวัดที่ทำงาน (ข้อมูลตัวอย่าง)
        </p>{" "}
        {/* Larger text */}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Visualization */}
        <div className="lg:col-span-2">
          <Card className="shadow-md rounded-xl">
            {" "}
            {/* Added shadow and rounded corners */}
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-semibold">
                {" "}
                {/* Larger, bolder title */}
                <MapPin className="mr-2 h-5 w-5 text-blue-600" />{" "}
                {/* Added text color to icon */}
                แผนที่ประเทศไทย
              </CardTitle>
              <CardDescription className="text-gray-600">
                คลิกที่จังหวัดเพื่อดูรายละเอียด
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Leaflet Map */}
              <div className="rounded-lg overflow-hidden min-h-[400px] relative z-0">
                <MapContainer
                  center={[15.870032, 100.992541]}
                  zoom={6}
                  scrollWheelZoom={false}
                  style={{ height: 600, width: "100%" }}
                  className="z-0"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {provinceData.map((province) => {
                    // ตัวอย่าง lat/lng สำหรับบางจังหวัด (ควรใช้ฐานข้อมูลจริงใน production)
                    const provinceCoords: Record<string, [number, number]> = {
                      กรุงเทพมหานคร: [13.7563, 100.5018],
                      เชียงใหม่: [18.7883, 98.9853],
                      ขอนแก่น: [16.4419, 102.8359],
                      สงขลา: [7.1756, 100.6144],
                      ชลบุรี: [13.3611, 100.9847],
                      ภูเก็ต: [7.8804, 98.3923],
                      นครราชสีมา: [14.9799, 102.0977],
                      ระยอง: [12.6814, 101.2789],
                    };
                    const coords = provinceCoords[province.province];
                    if (!coords) return null;
                    return (
                      <Marker
                        key={province.province}
                        position={coords}
                        icon={L.icon({
                          iconUrl:
                            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                          iconSize: [25, 41],
                          iconAnchor: [12, 41],
                        })}
                      >
                        <Popup>
                          <div className="font-bold text-base text-blue-700">
                            {province.province}
                          </div>
                          <div className="text-sm text-gray-700">
                            ศิษย์เก่า {province.count} คน
                          </div>
                          {province.alumni.length > 0 && (
                            <ul className="mt-2 space-y-1">
                              {province.alumni
                                .slice(0, 3)
                                .map((alumni, idx) => (
                                  <li
                                    key={idx}
                                    className="text-xs text-gray-600"
                                  >
                                    {alumni.name} - {alumni.position}
                                  </li>
                                ))}
                            </ul>
                          )}
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Province Details */}
        <div className="space-y-6">
          <Card className="shadow-md rounded-xl">
            {" "}
            {/* Added shadow and rounded corners */}
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-semibold">
                {" "}
                {/* Larger, bolder title */}
                <BarChart3 className="mr-2 h-5 w-5 text-purple-600" />{" "}
                {/* Added text color to icon */}
                สถิติรวม
              </CardTitle>
            </CardHeader>
            <CardContent className="py-6">
              {" "}
              {/* Added vertical padding */}
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-extrabold text-blue-600">
                    {totalAlumni}
                  </div>{" "}
                  {/* Larger, bolder stats */}
                  <p className="text-base text-gray-600">ศิษย์เก่าทั้งหมด</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-green-600">
                    {provinceData.length}
                  </div>{" "}
                  {/* Larger, bolder stats */}
                  <p className="text-base text-gray-600">
                    จังหวัดที่มีศิษย์เก่า
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md rounded-xl">
            {" "}
            {/* Added shadow and rounded corners */}
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                จังหวัดที่มีศิษย์เก่ามากที่สุด
              </CardTitle>{" "}
              {/* Larger, bolder title */}
            </CardHeader>
            <CardContent className="py-6">
              {" "}
              {/* Added vertical padding */}
              <div className="space-y-3">
                {provinceData.slice(0, 5).map((province, index) => (
                  <div
                    key={province.province}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedProvince?.province === province.province
                        ? "bg-blue-50 border border-blue-200 shadow-sm" // Enhanced selected state
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedProvince(province)}
                  >
                    <div className="flex items-center">
                      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600 mr-3 shadow-sm">
                        {" "}
                        {/* Larger, bolder number, added shadow */}
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-800 text-base">
                        {province.province}
                      </span>{" "}
                      {/* Larger, bolder text */}
                    </div>
                    <Badge
                      variant="secondary"
                      className="px-3 py-1 text-sm rounded-full"
                    >
                      {province.count} คน
                    </Badge>{" "}
                    {/* Enhanced badge styling */}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedProvince && (
            <Card className="shadow-md rounded-xl">
              {" "}
              {/* Added shadow and rounded corners */}
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  {selectedProvince.province}
                </CardTitle>{" "}
                {/* Larger, bolder title */}
                <CardDescription className="text-gray-600">
                  {selectedProvince.count} คน
                </CardDescription>
              </CardHeader>
              <CardContent className="py-6">
                {" "}
                {/* Added vertical padding */}
                <div className="space-y-4">
                  {" "}
                  {/* Increased spacing */}
                  {selectedProvince.alumni.slice(0, 5).map((alumni, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-blue-400 pl-4 py-1"
                    >
                      {" "}
                      {/* Darker border, added vertical padding */}
                      <div className="font-medium text-base text-gray-800">
                        {alumni.name}
                      </div>{" "}
                      {/* Larger, bolder text */}
                      <div className="text-sm text-gray-600">
                        {alumni.position}
                      </div>
                      <div className="text-xs text-gray-500">
                        {alumni.company}
                      </div>
                    </div>
                  ))}
                  {selectedProvince.alumni.length > 5 && (
                    <div className="text-center pt-4">
                      {" "}
                      {/* Increased padding */}
                      <Button
                        variant="link"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        {" "}
                        {/* Changed to link variant, bolder */}
                        ดูทั้งหมด ({selectedProvince.alumni.length} คน)
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
