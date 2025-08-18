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
import { MapOverview } from "@/components/map-system";
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
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>{" "}
          {/* Larger placeholder for title */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>{" "}
            {/* Rounded corners for skeleton cards */}
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>{" "}
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
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          แผนที่การกระจายตัว
        </h1>{" "}
        {/* Bolder title */}
        <p className="text-lg text-gray-600 dark:text-gray-400">
          การกระจายตัวของศิษย์เก่าตามจังหวัดที่ทำงาน (ข้อมูลตัวอย่าง)
        </p>{" "}
        {/* Larger text */}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Visualization */}
        <div className="lg:col-span-2">
          <Card className="shadow-md rounded-xl dark:bg-gray-900/80 dark:border-gray-700">
            {" "}
            {/* Added shadow and rounded corners */}
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-semibold dark:text-gray-100">
                {" "}
                {/* Larger, bolder title */}
                <MapPin className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />{" "}
                {/* Added text color to icon */}
                แผนที่ประเทศไทย
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                คลิกที่จังหวัดเพื่อดูรายละเอียด
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Map Overview Component */}
              <MapOverview />
            </CardContent>
          </Card>
        </div>

        {/* Province Details */}
        <div className="space-y-6">
          <Card className="shadow-md rounded-xl dark:bg-gray-900/80 dark:border-gray-700">
            {" "}
            {/* Added shadow and rounded corners */}
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-semibold dark:text-gray-100">
                {" "}
                {/* Larger, bolder title */}
                <BarChart3 className="mr-2 h-5 w-5 text-purple-600 dark:text-purple-400" />{" "}
                {/* Added text color to icon */}
                สถิติรวม
              </CardTitle>
            </CardHeader>
            <CardContent className="py-6">
              {" "}
              {/* Added vertical padding */}
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">
                    {totalAlumni}
                  </div>{" "}
                  {/* Larger, bolder stats */}
                  <p className="text-base text-gray-600 dark:text-gray-400">
                    ศิษย์เก่าทั้งหมด
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-green-600 dark:text-green-400">
                    {provinceData.length}
                  </div>{" "}
                  {/* Larger, bolder stats */}
                  <p className="text-base text-gray-600 dark:text-gray-400">
                    จังหวัดที่มีศิษย์เก่า
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md rounded-xl dark:bg-gray-900/80 dark:border-gray-700">
            {" "}
            {/* Added shadow and rounded corners */}
            <CardHeader>
              <CardTitle className="text-xl font-semibold dark:text-gray-100">
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
                        ? "bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 shadow-sm" // Enhanced selected state
                        : "hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => setSelectedProvince(province)}
                  >
                    <div className="flex items-center">
                      <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-sm font-bold text-blue-600 dark:text-blue-300 mr-3 shadow-sm">
                        {" "}
                        {/* Larger, bolder number, added shadow */}
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-800 dark:text-gray-200 text-base">
                        {province.province}
                      </span>{" "}
                      {/* Larger, bolder text */}
                    </div>
                    <Badge
                      variant="secondary"
                      className="px-3 py-1 text-sm rounded-full dark:bg-gray-700 dark:text-gray-200"
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
            <Card className="shadow-md rounded-xl dark:bg-gray-900/80 dark:border-gray-700">
              {" "}
              {/* Added shadow and rounded corners */}
              <CardHeader>
                <CardTitle className="text-xl font-semibold dark:text-gray-100">
                  {selectedProvince.province}
                </CardTitle>{" "}
                {/* Larger, bolder title */}
                <CardDescription className="text-gray-600 dark:text-gray-400">
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
                      className="border-l-4 border-blue-400 dark:border-blue-500 pl-4 py-1"
                    >
                      {" "}
                      {/* Darker border, added vertical padding */}
                      <div className="font-medium text-base text-gray-800 dark:text-gray-200">
                        {alumni.name}
                      </div>{" "}
                      {/* Larger, bolder text */}
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {alumni.position}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
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
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
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
