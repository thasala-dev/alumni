"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, Pie } from "react-chartjs-2";
import { Users, Percent } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

import { useEffect, useState } from "react";

export default function ReportPage() {
  const [yearStat, setYearStat] = useState<any[]>([]);
  const [usage, setUsage] = useState<{ active: number; total: number }>({
    active: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/report");
        if (res.ok) {
          const data = await res.json();
          setYearStat(Array.isArray(data.yearStat) ? data.yearStat : []);
          setUsage(data.usage || { active: 0, total: 0 });
        }
      } catch {}
      setLoading(false);
    };
    fetchReport();
  }, []);

  // Prepare data for charts

  // สถานะภาษาอังกฤษ -> ไทย
  const statusMap: Record<string, string> = {
    unregistered: "ยังไม่ลงทะเบียน",
    pending: "รออนุมัติ",
    approved: "อนุมัติแล้ว",
    rejected: "ไม่อนุมัติ",
    suspended: "ระงับใช้งาน",
  };
  const statusList = [
    "unregistered",
    "pending",
    "approved",
    "rejected",
    "suspended",
  ];

  // 1. Bar chart: จำนวนศิษย์เก่าแต่ละรุ่น
  const barData = {
    labels: yearStat.map((y: any) => y.admit_year),
    datasets: [
      {
        label: "จำนวนศิษย์เก่า",
        data: yearStat.map((y: any) => y.count || 0),
        backgroundColor: "#81B214",
      },
    ],
  };

  // 2. Stacked bar chart: สถานะศิษย์เก่าแต่ละรุ่น
  const stackedBarData = {
    labels: yearStat.map((y: any) => y.admit_year),
    datasets: statusList.map((status, idx) => ({
      label: statusMap[status],
      data: yearStat.map((y: any) => y[status] || 0),
      backgroundColor: ["#E5E7EB", "#F59E42", "#50B003", "#EF4444", "#6366F1"][
        idx
      ],
    })),
  };

  // 3. Pie chart: สัดส่วนสถานะศิษย์เก่าทั้งหมด
  const totalStatus = statusList.reduce((acc, status) => {
    acc[status] = yearStat.reduce(
      (sum: any, y: any) => sum + (y[status] || 0),
      0
    );
    return acc;
  }, {} as Record<string, number>);
  const pieData = {
    labels: statusList.map((status) => statusMap[status]),
    datasets: [
      {
        data: statusList.map((status) => totalStatus[status]),
        backgroundColor: [
          "#E5E7EB",
          "#F59E42",
          "#50B003",
          "#EF4444",
          "#6366F1",
        ],
      },
    ],
  };

  // 4. Progress bar: อัตราการใช้งานระบบ
  const usagePercent = usage.total
    ? Math.round((usage.active / usage.total) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#81B214]">รายงานระบบ</h1>
      {loading ? (
        <div className="text-center text-gray-400">Loading...</div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            {/* 1. Bar Chart: จำนวนศิษย์เก่าแต่ละรุ่น */}
            <Card className="bg-white dark:bg-gray-900/80 border-gray-200 dark:border-gray-700 p-0">
              <CardHeader>
                <CardTitle>
                  <Users className="inline-block mr-2" />{" "}
                  จำนวนศิษย์เก่าแต่ละรุ่น
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="w-full">
                  <Bar
                    data={barData}
                    options={{
                      indexAxis: "y",
                      plugins: { legend: { display: false } },
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="col-span-2">
            {/* 2. Stacked Bar Chart: สถานะศิษย์เก่าแต่ละรุ่น */}
            <Card className="bg-white dark:bg-gray-900/80 border-gray-200 dark:border-gray-700 p-0">
              <CardHeader>
                <CardTitle>
                  <Users className="inline-block mr-2" />{" "}
                  สถานะศิษย์เก่าแต่ละรุ่น
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="w-full">
                  <Bar
                    data={stackedBarData}
                    options={{
                      indexAxis: "y",
                      plugins: { legend: { display: true } },
                      responsive: true,
                      scales: {
                        x: { stacked: true },
                        y: { stacked: true },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-2">
            {/* 3. Pie Chart: สัดส่วนสถานะศิษย์เก่าทั้งหมด */}
            <Card className="bg-white dark:bg-gray-900/80 border-gray-200 dark:border-gray-700 p-0">
              <CardHeader>
                <CardTitle>
                  <Percent className="inline-block mr-2" />{" "}
                  สัดส่วนสถานะศิษย์เก่าทั้งหมด
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <Pie
                      data={pieData}
                      options={{ plugins: { legend: { display: false } } }}
                    />
                  </div>
                  <div>
                    {statusList.map((status, idx) => (
                      <div
                        key={status}
                        className="flex items-center justify-between gap-2 mb-1"
                      >
                        <div>
                          <span
                            className="inline-block w-2 h-2 rounded-full"
                            style={{
                              background:
                                pieData.datasets[0].backgroundColor[idx],
                            }}
                          ></span>
                          <span className="text-xs ml-1">
                            {statusMap[status]}
                          </span>
                        </div>

                        <span className="text-gray-500 text-end">
                          {totalStatus[status]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="col-span-2">
            {/* 4. Progress Bar: อัตราการใช้งานระบบ */}
            <Card className="bg-white dark:bg-gray-900/80 border-gray-200 dark:border-gray-700 p-0">
              <CardHeader>
                <CardTitle>
                  <Percent className="inline-block mr-2" /> อัตราการใช้งานระบบ
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-full">
                    <div className="w-full bg-gray-200 rounded-full h-6">
                      <div
                        className="bg-green-500 h-6 rounded-full text-white flex items-center justify-center text-lg font-bold transition-all"
                        style={{ width: `${usagePercent}%` }}
                      >
                        {usagePercent}%
                      </div>
                    </div>
                    <div className="text-gray-500 mt-2 text-sm">
                      {usage.active} / {usage.total} ศิษย์เก่าที่ใช้งานระบบ
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
