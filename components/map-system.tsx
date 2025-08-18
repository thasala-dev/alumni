"use client";

import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Annotation,
} from "react-simple-maps";
import { ThailandTopoJson } from "@/data/thailand-geo";
import { ProvincePositions } from "@/data/thailand-province";
import { useTheme } from "next-themes";

interface ProvinceData {
  provinceCode?: string; // Optional code for the province
  name: string;
  count: number;
  coordinates: [number, number]; // [longitude, latitude]
}

// Demo data for alumni distribution by province
const demoProvinceData: ProvinceData[] = [
  {
    provinceCode: "th-10",
    name: "กรุงเทพมหานคร",
    count: 342,
    coordinates: [100.5018, 13.7563],
  },
  {
    provinceCode: "th-80",
    name: "นครศรีธรรมราช",
    count: 156,
    coordinates: [98.9893, 18.7883],
  },
  {
    provinceCode: "th-40",
    name: "ขอนแก่น",
    count: 98,
    coordinates: [102.8358, 16.4325],
  },
  {
    provinceCode: "th-90",
    name: "สงขลา",
    count: 87,
    coordinates: [100.5955, 7.2],
  },
  {
    provinceCode: "th-20",
    name: "ชลบุรี",
    count: 76,
    coordinates: [100.9883, 13.36],
  },
  {
    provinceCode: "th-83",
    name: "ภูเก็ต",
    count: 50,
    coordinates: [98.3923, 7.8804],
  },
  {
    provinceCode: "th-30",
    name: "นครราชสีมา",
    count: 45,
    coordinates: [102.0833, 14.975],
  },
  {
    provinceCode: "th-21",
    name: "ระยอง",
    count: 30,
    coordinates: [101.2186, 12.6767],
  },
  {
    provinceCode: "th-41",
    name: "อุดรธานี",
    count: 28,
    coordinates: [102.8425, 17.4138],
  },
  {
    provinceCode: "th-84",
    name: "สุราษฎร์ธานี",
    count: 25,
    coordinates: [99.3331, 9.1382],
  },
];

// Get default color for provinces without data
const getDefaultProvinceColor = (): string => {
  // Use a lighter color that works in both light and dark modes
  return "#e5e7eb"; // Light gray for light mode, will be overridden by SVG styling in dark mode
};

// Get alumni count for a province

export function MapOverview() {
  const { theme, setTheme } = useTheme();
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    data: {
      provinceName: string | null;
      provinceCode: string | null;
      alumniCount: number;
    };

    x: number;
    y: number;
    visible: boolean;
  }>({
    data: {
      provinceName: null,
      provinceCode: null,
      alumniCount: 0,
    },

    x: 0,
    y: 0,
    visible: false,
  });

  // Get default color for provinces without data - theme aware
  const getDefaultProvinceColor = (): string => {
    return theme === "dark" ? "#374151" : "#e5e7eb"; // Darker gray for dark mode, light gray for light mode
  };

  const getProvinceColor = (count: number): string => {
    if (count >= 200) return theme === "dark" ? "#3b82f6" : "#1e40af"; // Brighter blue in dark mode
    if (count >= 100) return theme === "dark" ? "#60a5fa" : "#3b82f6"; // Light blue in dark mode
    if (count >= 50) return theme === "dark" ? "#93c5fd" : "#60a5fa"; // Lighter blue in dark mode
    if (count >= 20) return theme === "dark" ? "#bfdbfe" : "#93c5fd"; // Much lighter in dark mode
    return theme === "dark" ? "#dbeafe" : "#dbeafe"; // Lightest blue for both
  };

  const handleGeographyClick = (geo: any) => {
    const provinceName = geo.properties.name;
    setSelectedProvince(provinceName);
  };

  const getDataofProvince = (geo: any) => {
    const provinceCode = Object.entries(ProvincePositions).find(
      ([code, pos]: [string, any]) => pos.name_eng === geo.properties.name
    )?.[0];

    const provinceData = demoProvinceData.find(
      (p) => p.provinceCode === provinceCode
    );
    return {
      provinceName: provinceCode
        ? {
            code: provinceCode,
            ...(ProvincePositions[
              provinceCode as keyof typeof ProvincePositions
            ] || {}),
          }
        : null,
      provinceData: provinceData || null,
    };
  };

  const handleMouseEnter = (geo: any, event: React.MouseEvent) => {
    const { provinceName, provinceData } = getDataofProvince(geo);

    const count = provinceData?.count || 0;

    setTooltip({
      data: {
        provinceName: provinceName?.name || "ไม่ระบุ",
        provinceCode: provinceName?.code || null,
        alumniCount: count,
      },

      x: event.clientX,
      y: event.clientY,
      visible: true,
    });
  };

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        {/* Map Container */}
        <div className="w-full ">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 2900,
              center: [100.5, 13.3],
            }}
            // width={800}
            height={800}
            className="w-full h-full"
          >
            {/* <ZoomableGroup zoom={1} center={[100.5, 13.7]}> */}
            <Geographies geography={ThailandTopoJson}>
              {({ geographies }: { geographies: any[] }) =>
                geographies.map((geo: any) => {
                  const { provinceData } = getDataofProvince(geo);

                  const fillColor =
                    provinceData && provinceData?.count > 0
                      ? getProvinceColor(provinceData?.count)
                      : getDefaultProvinceColor();

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => handleGeographyClick(geo)}
                      onMouseEnter={(event: any) =>
                        handleMouseEnter(geo, event)
                      }
                      onMouseLeave={handleMouseLeave}
                      style={{
                        default: {
                          fill: fillColor,
                          stroke: theme === "dark" ? "#1f2937" : "#ffffff",
                          strokeWidth: 0.5,
                          outline: "none",
                        },
                        hover: {
                          fill: theme === "dark" ? "#60a5fa" : "#1e40af",
                          stroke: theme === "dark" ? "#1f2937" : "#ffffff",
                          strokeWidth: 1,
                          outline: "none",
                          cursor: "pointer",
                        },
                        pressed: {
                          fill: theme === "dark" ? "#3b82f6" : "#1e3a8a",
                          stroke: theme === "dark" ? "#1f2937" : "#ffffff",
                          strokeWidth: 1,
                          outline: "none",
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
            {/* {demoProvinceData.slice(0, 5).map((province) => (
                <Annotation
                  key={province.name}
                  subject={province.coordinates}
                  dx={0}
                  dy={0}
                  connectorProps={{
                    stroke: "#1e40af",
                    strokeWidth: 1,
                    strokeLinecap: "round",
                  }}
                >
                  <circle
                    r={Math.sqrt(province.count) / 2}
                    fill="#1e40af"
                    fillOpacity={0.7}
                    stroke="#ffffff"
                    strokeWidth={1}
                  />
                  <text
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    style={{
                      fontFamily: "system-ui",
                      fontSize: "10px",
                      fill: "#ffffff",
                      fontWeight: "bold",
                    }}
                  >
                    {province.count}
                  </text>
                </Annotation>
              ))} */}
            {/* </ZoomableGroup> */}
          </ComposableMap>
        </div>

        {/* Tooltip */}
        {tooltip.visible && (
          <div
            className="fixed z-50 px-3 py-2 text-sm text-white bg-gray-900 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg pointer-events-none backdrop-blur-sm"
            style={{
              left: tooltip.x + 10,
              top: tooltip.y - 30,
            }}
          >
            <strong className="text-white dark:text-gray-100">
              {tooltip.data.provinceName || "ไม่ระบุ"}
            </strong>
            <br />
            <span className="text-gray-200 dark:text-gray-300">
              {tooltip.data.alumniCount || 0} คน
            </span>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 right-4 p-3 ">
          <div className="mb-2 text-xs font-semibold text-gray-900 dark:text-gray-100">
            จำนวนศิษย์เก่าต่อจังหวัด
          </div>
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: "#1e40af" }}
              ></div>
              <span className="text-gray-700 dark:text-gray-300 text-xs">
                200+ คน
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: "#3b82f6" }}
              ></div>
              <span className="text-gray-700 dark:text-gray-300 text-xs">
                100-199 คน
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: "#60a5fa" }}
              ></div>
              <span className="text-gray-700 dark:text-gray-300 text-xs">
                50-99 คน
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: "#93c5fd" }}
              ></div>
              <span className="text-gray-700 dark:text-gray-300 text-xs">
                20-49 คน
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: "#dbeafe" }}
              ></div>
              <span className="text-gray-700 dark:text-gray-300 text-xs">
                1-19 คน
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gray-300 dark:bg-gray-600"></div>
              <span className="text-gray-700 dark:text-gray-300 text-xs">
                ไม่มีข้อมูล
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
