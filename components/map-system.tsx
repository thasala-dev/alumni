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
import { MapPin, User, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function MapOverview() {
  const { theme, setTheme } = useTheme();
  const [provinceData, setProvinceData] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<any>(null);
  const [tooltip, setTooltip] = useState<{
    data: {
      type?: "province" | "alumni";
      avatarUrl?: string | null;
      provinceName: string | null;
      provinceCode: string | null;
      alumniCount: number | string;
    };

    x: number;
    y: number;
    visible: boolean;
  }>({
    data: {
      type: "province",
      avatarUrl: null,
      provinceName: null,
      provinceCode: null,
      alumniCount: 0,
    },

    x: 0,
    y: 0,
    visible: false,
  });

  const [position, setPosition] = useState({
    coordinates: [101.5, 13.3],
    zoom: 1,
  });

  useEffect(() => {
    const initializePage = async () => {
      try {
        const stat = await fetch("/api/map?show=alumni");
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
    const { provinceName, provinceData } = getDataofProvince(geo);
    console.log(provinceName, provinceData);
    if (!provinceName || !provinceData) return;
    handleMoveEnd({
      coordinates: provinceName?.coordinates as [number, number],
      zoom: provinceName?.zoom || 4.5,
    });

    setSelectedProvince(provinceData);
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
    if (selectedProvince) return;
    const { provinceName, provinceData } = getDataofProvince(geo);
    const count = provinceData?.count || 0;
    setTooltip({
      data: {
        type: "province",
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

  const handleZoomIn = () => {
    if (position.zoom >= 8) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.2 }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.2 }));
  };

  const handleMoveEnd = (position: any) => {
    setPosition(position);
  };

  const handleReset = () => {
    setSelectedProvince(null);
    setPosition({
      coordinates: [101.5, 13.3],
      zoom: 1,
    });
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
            <ZoomableGroup
              zoom={position.zoom}
              center={position.coordinates as [number, number]}
              onMoveEnd={handleMoveEnd}
              maxZoom={9}
            >
              <Geographies geography={ThailandTopoJson}>
                {({ geographies }: { geographies: any[] }) =>
                  geographies.map((geo: any) => {
                    const { provinceData } = getDataofProvince(geo);
                    const fillColor =
                      provinceData && provinceData?.count > 0
                        ? selectedProvince &&
                          selectedProvince.provinceCode ===
                            provinceData?.provinceCode
                          ? "#f37423"
                          : getProvinceColor(provinceData?.count)
                        : getDefaultProvinceColor();

                    const hoverColor =
                      provinceData && provinceData?.count > 0
                        ? selectedProvince &&
                          selectedProvince.provinceCode ===
                            provinceData?.provinceCode
                          ? "#f37423"
                          : "#81B214"
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
                            fill: hoverColor,
                            stroke: theme === "dark" ? "#1f2937" : "#ffffff",
                            strokeWidth: 0.5,
                            outline: "none",
                            cursor: "pointer",
                          },
                        }}
                      />
                    );
                  })
                }
              </Geographies>

              {selectedProvince &&
                selectedProvince.alumni
                  .filter((alumni: any) => {
                    const lat = Number(alumni.latitude);
                    const lng = Number(alumni.longitude);
                    return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
                  })
                  .map((alumni: any) => (
                    <Annotation
                      key={alumni.id}
                      subject={[
                        Number(alumni.longitude),
                        Number(alumni.latitude),
                      ]}
                      dx={0}
                      dy={0}
                      connectorProps={{
                        stroke: "transparent",
                        strokeWidth: 0,
                      }}
                    >
                      <g
                        style={{ cursor: "pointer" }}
                        onMouseEnter={(e) => {
                          setTooltip({
                            data: {
                              type: "alumni",
                              avatarUrl: alumni.avatar_url || null,
                              provinceName: `${alumni.first_name} ${alumni.last_name}`,
                              provinceCode:
                                alumni.current_position || "ไม่ระบุตำแหน่ง",
                              alumniCount:
                                alumni.current_company || "ไม่ระบุบริษัท",
                            },
                            x: e.clientX,
                            y: e.clientY - 60,
                            visible: true,
                          });
                        }}
                        onMouseMove={(e) => {
                          setTooltip((prev) => ({
                            ...prev,
                            x: e.clientX,
                            y: e.clientY - 60,
                          }));
                        }}
                        onMouseLeave={() => {
                          setTooltip((prev) => ({ ...prev, visible: false }));
                        }}
                        onClick={() => {
                          window.open(
                            `/dashboard/alumni/${alumni.id}`,
                            "_blank"
                          );
                        }}
                      >
                        {/* User Icon Background Circle */}
                        <circle
                          r={Math.max(2.5, 3 - position.zoom * 0.9)}
                          fill="#ffffff"
                          stroke="#81B214"
                          strokeWidth={0.5}
                          fillOpacity={0.95}
                        />

                        <g
                          transform={`scale(${Math.max(
                            0.3,
                            0.4 - position.zoom * 0.09
                          )})`}
                        >
                          {/* User Head */}
                          <circle cx={0} cy={-2} r={3} fill="#81B214" />
                          {/* User Body */}
                          <path
                            d="M -4 8 C -4 4 -2 2 0 2 C 2 2 4 4 4 8 Z"
                            fill="#81B214"
                          />
                        </g>
                      </g>
                    </Annotation>
                  ))}
            </ZoomableGroup>
          </ComposableMap>
        </div>

        {tooltip.visible && (
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

            {/* Content */}
            <div className="flex items-start gap-3">
              {tooltip.data.type === "alumni" ? (
                <Avatar className="w-10 h-10">
                  <AvatarImage src={tooltip.data.avatarUrl || ""} />
                  <AvatarFallback className="bg-[#81B214]/20 text-[#81B214] font-semibold">
                    {tooltip.data.provinceName
                      ? tooltip.data.provinceName.charAt(0)
                      : "A"}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="flex-shrink-0 w-8 h-8 bg-[#81B214]/20 rounded-lg flex items-center justify-center mt-0.5">
                  <MapPin className="h-5 w-5 text-[#81B214]" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="text-lg font-semibold text-[#81B214] leading-tight">
                  {tooltip.data.provinceName || "ไม่ระบุ"}
                </div>

                <div className="flex flex-col gap-1 mt-1">
                  {tooltip.data.type === "alumni" && (
                    <div className="text-gray-600 dark:text-gray-400 text-xs font-medium">
                      {tooltip.data.provinceCode || "ไม่ระบุตำแหน่ง"}
                    </div>
                  )}
                  {typeof tooltip.data.alumniCount === "string" && (
                    <div className="text-gray-600 dark:text-gray-400 text-xs">
                      {tooltip.data.alumniCount}
                    </div>
                  )}
                  {typeof tooltip.data.alumniCount === "number" &&
                    tooltip.data.alumniCount > 0 && (
                      <div className="text-gray-600 dark:text-gray-400 text-xs">
                        {tooltip.data.alumniCount} คน
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedProvince ? (
          <div className="absolute top-4 right-4 p-0">
            <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 min-w-[280px] overflow-hidden">
              {/* Header with close button */}
              <div className="relative  p-4">
                <button
                  className="absolute top-2 right-2 p-1.5 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/20 rounded-lg transition-all duration-200"
                  onClick={handleReset}
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="pr-8">
                  <h3 className="dark:text-white font-semibold text-lg">
                    จังหวัด{selectedProvince.name || "ไม่ระบุ"}
                  </h3>
                  <p className="dark:text-white/90 text-sm">
                    จำนวนศิษย์เก่า {selectedProvince.count || 0} คน
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 pt-0">
                {/* Alumni list */}
                <div className="max-h-64 overflow-y-auto">
                  {selectedProvince.alumni.map((alumni: any) => (
                    <a
                      key={alumni.id}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                      href={`/dashboard/alumni/${alumni.id}`}
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={alumni.profile_image_url || ""} />
                        <AvatarFallback className="bg-[#81B214]/20 text-[#81B214] font-semibold">
                          {alumni.first_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                          {alumni.first_name} {alumni.last_name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {alumni.current_position} {alumni.current_company}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
