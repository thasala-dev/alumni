"use client";

import { useEffect, useState } from "react";
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

export function MapOverview() {
  const { theme, setTheme } = useTheme();
  const [provinceData, setProvinceData] = useState<any[]>([]);
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

  useEffect(() => {
    const initializePage = async () => {
      try {
        const stat = await fetch("/api/map");
        const data = await stat.json();
        setProvinceData(data);
      } catch (e) {
        console.error("Error fetching user:", e);
      }
    };
    initializePage();
  }, []);

  const getDefaultProvinceColor = (): string => {
    return theme === "dark" ? "#374151" : "#e5e7eb"; // Darker gray for dark mode, light gray for light mode
  };
  const getProvinceColor = (count: number): string => {
    if (count >= 200) return "#81B214"; // Deep green
    if (count >= 100) return "#A3C957"; // Medium green
    if (count >= 50) return "#C7E77F"; // Light green
    if (count >= 20) return "#E2F9B8"; // Very light green
    return "#F6FFDE"; // Pale green
  };

  const handleGeographyClick = (geo: any) => {
    const provinceName = geo.properties.name;
    setSelectedProvince(provinceName);
  };

  const getDataofProvince = (geo: any) => {
    const provinceCode = Object.entries(ProvincePositions).find(
      ([code, pos]: [string, any]) => pos.name_eng === geo.properties.name
    )?.[0];

    const provinceDataS = provinceData.find(
      (p: any) => p.provinceCode === provinceCode
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
      provinceData: provinceDataS || null,
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
              center: [101.5, 13.3],
            }}
            width={450}
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
                          fill: "#81B214",
                          stroke: theme === "dark" ? "#1f2937" : "#ffffff",
                          strokeWidth: 1,
                          outline: "none",
                          cursor: "pointer",
                        },
                        pressed: {
                          fill: "#81B214",
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
            {/* {provinceData.slice(0, 5).map((province) => (
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
        {tooltip.visible && tooltip.data.alumniCount > 0 && (
          <div
            className="fixed z-50 px-4 py-3 text-sm bg-white/95 dark:bg-gray-900/95 border border-gray-200/80 dark:border-gray-700/80 rounded-xl shadow-2xl pointer-events-none backdrop-blur-md transition-all duration-200 ease-out"
            style={{
              left: tooltip.x + 15,
              top: tooltip.y - 50,
              background:
                theme === "dark"
                  ? "linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.95) 100%)"
                  : "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.95) 100%)",
            }}
          >
            {/* Arrow pointer */}
            <div
              className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[6px] border-b-[6px] border-r-[8px] border-transparent"
              style={{
                borderRightColor:
                  theme === "dark"
                    ? "rgba(17, 24, 39, 0.95)"
                    : "rgba(255, 255, 255, 0.95)",
              }}
            />

            {/* Province Icon */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mt-0.5">
                <svg
                  className="w-4 h-4 text-[#81B214]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-xl font-semibold text-[#81B214] text-sm leading-tight">
                  {tooltip.data.provinceName || "ไม่ระบุ"}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-600 dark:text-gray-400 text-xs font-medium">
                      {tooltip.data.alumniCount || 0} คน
                    </span>
                  </div>
                </div>
              </div>
            </div>
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
                style={{ backgroundColor: "#81B214" }}
              ></div>
              <span className="text-gray-700 dark:text-gray-300 text-xs">
                200+ คน
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: "#A3C957" }}
              ></div>
              <span className="text-gray-700 dark:text-gray-300 text-xs">
                100-199 คน
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: "#C7E77F" }}
              ></div>
              <span className="text-gray-700 dark:text-gray-300 text-xs">
                50-99 คน
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: "#E2F9B8" }}
              ></div>
              <span className="text-gray-700 dark:text-gray-300 text-xs">
                20-49 คน
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: "#F6FFDE" }}
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
