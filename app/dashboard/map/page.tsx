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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
      <div>
        <h1 className="text-3xl font-bold text-[#81B214]">
          แผนที่การกระจายตัว
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          การกระจายตัวของศิษย์เก่าตามจังหวัดที่ทำงาน
        </p>
      </div>
      <MapOverview />
    </div>
  );
}
