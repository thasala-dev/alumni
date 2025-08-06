"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MapPin, Newspaper, MessageSquare, Calendar, TrendingUp } from "lucide-react"
// Removed: import { supabase, isSupabaseConfigured } from "@/lib/supabase"

interface DashboardStats {
  totalAlumni: number
  pendingApprovals: number
  totalNews: number
  totalDiscussions: number
  recentRegistrations: number
  topProvinces: Array<{ province: string; count: number }>
}

// isDemoMode is now always true as we are using mock data
const isDemoMode = true

// Demo data for when Supabase is not configured
const demoStats: DashboardStats = {
  totalAlumni: 1247,
  pendingApprovals: 23,
  totalNews: 45,
  totalDiscussions: 156,
  recentRegistrations: 18,
  topProvinces: [
    { province: "กรุงเทพมหานคร", count: 342 },
    { province: "เชียงใหม่", count: 156 },
    { province: "ขอนแก่น", count: 98 },
    { province: "สงขลา", count: 87 },
    { province: "ชลบุรี", count: 76 },
  ],
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(demoStats)
  const [loading, setLoading] = useState(true) // Start loading to simulate fetch

  useEffect(() => {
    // Simulate data fetching
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay
      setStats(demoStats)
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: "ศิษย์เก่าทั้งหมด",
      value: stats.totalAlumni.toLocaleString(),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "รออนุมัติ",
      value: stats.pendingApprovals.toLocaleString(),
      icon: Calendar,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "ข่าวสาร",
      value: stats.totalNews.toLocaleString(),
      icon: Newspaper,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "กระทู้สนทนา",
      value: stats.totalDiscussions.toLocaleString(),
      icon: MessageSquare,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">แดชบอร์ด</h1>
        <p className="text-gray-600">ภาพรวมระบบจัดการศิษย์เก่า (ข้อมูลตัวอย่าง)</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`p-3 rounded-full ${card.bgColor}`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              กิจกรรมล่าสุด
            </CardTitle>
            <CardDescription>การลงทะเบียนใหม่ใน 30 วันที่ผ่านมา</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-4xl font-bold text-blue-600 mb-2">{stats.recentRegistrations}</div>
              <p className="text-gray-600">ศิษย์เก่าใหม่</p>
            </div>
          </CardContent>
        </Card>

        {/* Top Provinces */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              จังหวัดที่ทำงานมากที่สุด
            </CardTitle>
            <CardDescription>การกระจายตัวของศิษย์เก่า</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topProvinces.length > 0 ? (
                stats.topProvinces.map((province, index) => (
                  <div key={province.province} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-600 mr-3">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium">{province.province}</span>
                    </div>
                    <span className="text-sm text-gray-600">{province.count} คน</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">ยังไม่มีข้อมูลสถานที่ทำงาน</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
