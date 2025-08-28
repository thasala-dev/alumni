"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Users,
  MapPin,
  Newspaper,
  MessageSquare,
  Calendar,
  ArrowRight,
  Mail,
  Facebook,
  Phone,
  MapIcon,
} from "lucide-react";

// Dynamically import MapOverview to prevent SSR issues
const MapOverview = dynamic(
  () =>
    import("@/components/map-overview").then((mod) => ({
      default: mod.MapOverview,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 animate-pulse flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading map...</div>
      </div>
    ),
  }
);

export default function HomePage() {
  const [stats, setStats] = useState({
    totalAlumni: 2847,
    totalNews: 65,
    totalDiscussions: 298,
    provinces: 45,
  });

  const features = [
    {
      icon: Users,
      title: "เครือข่ายศิษย์เก่า",
      description:
        "เชื่อมต่อกับศิษย์เก่าทั่วประเทศ แลกเปลี่ยนประสบการณ์และโอกาสในการทำงาน",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: MapPin,
      title: "แผนที่การกระจายตัว",
      description: "ดูการกระจายตัวของศิษย์เก่าตามจังหวัดและสถานประกอบการ",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Newspaper,
      title: "ข่าวสารศิษย์เก่า",
      description: "อัปเดตข่าวสารศิษย์เก่า ตำแหน่งงาน และกิจกรรมสำคัญ",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: MessageSquare,
      title: "เว็บบอร์ดศิษย์เก่า",
      description:
        "แลกเปลี่ยนความคิดเห็น ประสบการณ์การทำงาน และความรู้ทางเภสัชศาสตร์",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const recentNews = [
    {
      id: 1,
      title: "ประกาศการจัดงานประชุมใหญ่สมาคมศิษย์เก่า ประจำปี 2568",
      date: "15 มกราคม 2568",
      excerpt:
        "เชิญร่วมงานประชุมใหญ่สมาคมศิษย์เก่า ประจำปี 2568 ในวันเสาร์ที่ 15 มิถุนายน 2568...",
    },
    {
      id: 2,
      title: "เปิดรับสมัครทุนวิจัยด้านเภสัชศาสตร์สำหรับศิษย์เก่า",
      date: "10 มกราคม 2568",
      excerpt:
        "สมาคมศิษย์เก่าขอประกาศเปิดรับสมัครทุนวิจัยด้านเภสัชศาสตร์สำหรับศิษย์เก่า...",
    },
    {
      id: 3,
      title: "อัปเดตแนวทางปฏิบัติทางเภสัชกรรมใหม่ประจำปี 2568",
      date: "5 มกราคม 2568",
      excerpt:
        "สภาเภสัชกรรมประกาศแนวทางปฏิบัติใหม่สำหรับเภสัชกร เพื่อยกระดับมาตรฐานวิชาชีพ...",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 relative overflow-x-hidden">
      {/* Theme Toggle Button */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Decorative blurred shape */}
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-green-200 via-indigo-200 to-purple-200 dark:from-green-900 dark:via-indigo-900 dark:to-purple-900 rounded-full blur-3xl opacity-40 animate-pulse z-0"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-gradient-to-tr from-pink-200 via-green-100 to-indigo-100 dark:from-pink-900 dark:via-green-900 dark:to-indigo-900 rounded-full blur-3xl opacity-30 animate-pulse z-0"
          aria-hidden="true"
        />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="mb-10">
            <Badge
              variant="secondary"
              className="mb-4 px-5 py-2 text-base rounded-full shadow-md bg-white/80 dark:bg-gray-900/80 backdrop-blur border border-green-100 dark:border-gray-800 animate-fade-in"
            >
              เชื่อมต่อ • แลกเปลี่ยน • พัฒนาวิชาชีพ
            </Badge>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight drop-shadow-lg animate-fade-in-up">
              เครือข่าย
              <span className="text-[#81B214]">ศิษย์เก่า</span>
              <br />
              สำนักเภสัชศาสตร์ วลัยลักษณ์
            </h1>
            <p className="text-2xl text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-100">
              เชื่อมต่อกับศิษย์เก่าทั่วประเทศ
              แลกเปลี่ยนประสบการณ์และร่วมพัฒนาวงการเภสัชกรรมไทยไปด้วยกัน
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-200">
              <Link href="/auth/login">
                <Button
                  size="lg"
                  className="w-full sm:w-auto rounded-xl text-xl font-bold bg-gradient-to-r from-[#81B214] to-[#50B003] shadow-lg transition-all duration-200 scale-100 hover:scale-105"
                >
                  เข้าสู่ระบบ
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-white/80 dark:bg-gray-900/80 rounded-xl text-xl font-bold border-gray-300 dark:border-gray-700 hover:border-[#81B214] hover:text-[#81B214] shadow transition-all duration-200 scale-100 hover:scale-105"
              >
                เรียนรู้เพิ่มเติม
              </Button>
            </div>
          </div>
          {/* Divider */}
          <div className="w-full flex justify-center my-12 animate-fade-in-up delay-300">
            <div className="h-1 w-40 bg-gradient-to-r from-[#81B214] to-[#50B003] rounded-full opacity-60" />
          </div>
          {/* Stats */}
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10 animate-fade-in-up delay-400 items-center">
            <div className="col-span-2">
              <MapOverview />
            </div>

            <div className="grid grid-cols-1 gap-10 mt-10 animate-fade-in-up delay-400">
              <div className="text-center group transition-all">
                <div className="text-5xl md:text-6xl font-extrabold text-[#81B214] mb-2 drop-shadow group-hover:scale-110 transition-transform duration-200">
                  {stats.totalAlumni.toLocaleString()}
                </div>
                <div className="text-gray-700 dark:text-gray-300 text-lg font-medium">
                  ศิษย์เก่า
                </div>
              </div>
              <div className="text-center group transition-all">
                <div className="text-5xl md:text-6xl font-extrabold text-blue-600 dark:text-blue-400 mb-2 drop-shadow group-hover:scale-110 transition-transform duration-200">
                  {stats.provinces}
                </div>
                <div className="text-gray-700 dark:text-gray-300 text-lg font-medium">
                  จังหวัด
                </div>
              </div>
              <div className="text-center group transition-all">
                <div className="text-5xl md:text-6xl font-extrabold text-purple-600 dark:text-purple-400 mb-2 drop-shadow group-hover:scale-110 transition-transform duration-200">
                  {stats.totalNews}
                </div>
                <div className="text-gray-700 dark:text-gray-300 text-lg font-medium">
                  ข่าวสาร
                </div>
              </div>
              <div className="text-center group transition-all">
                <div className="text-5xl md:text-6xl font-extrabold text-orange-500 dark:text-orange-400 mb-2 drop-shadow group-hover:scale-110 transition-transform duration-200">
                  {stats.totalDiscussions}
                </div>
                <div className="text-gray-700 dark:text-gray-300 text-lg font-medium">
                  กระทู้ศิษย์เก่า
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-[#81B214] to-[#50B003]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              ฟีเจอร์สำหรับศิษย์เก่า
            </h2>
            {/* Bolder title */}
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              ระบบเครือข่ายศิษย์เก่าที่ครบครันและใช้งานง่าย เพื่อการเชื่อมต่อกัน
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Increased gap */}
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center shadow-md hover:shadow-xl transition-shadow duration-300 rounded-xl bg-white dark:bg-gray-900"
              >
                {/* Enhanced shadow and hover */}
                <CardContent className="p-8">
                  {/* Increased padding */}
                  <div
                    className={`inline-flex p-4 rounded-full ${feature.bgColor} dark:bg-gray-800 mb-6 shadow-sm`}
                  >
                    {/* Larger padding, added shadow */}
                    <feature.icon className={`h-7 w-7 ${feature.color}`} />
                    {/* Larger icon */}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  {/* Larger title */}
                  <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                    {feature.description}
                  </p>
                  {/* Adjusted text size and line height */}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent News Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
            {" "}
            {/* Adjusted for responsiveness */}
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                ข่าวสารศิษย์เก่าล่าสุด
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                อัปเดตข่าวสารและกิจกรรมสำคัญ
              </p>
            </div>
            <Link href="/auth/login">
              <Button
                variant="outline"
                className="rounded-lg border-gray-300 dark:border-gray-700 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {" "}
                {/* Enhanced outline button */}
                ดูทั้งหมด
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {" "}
            {/* Increased gap */}
            {recentNews.map((news) => (
              <Card
                key={news.id}
                className="shadow-md hover:shadow-xl transition-shadow duration-300 rounded-xl bg-white dark:bg-gray-900"
              >
                {" "}
                {/* Enhanced shadow and hover */}
                <CardHeader className="pb-4">
                  {" "}
                  {/* Adjusted padding */}
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <Calendar className="mr-2 h-4 w-4 text-gray-400 dark:text-gray-500" />{" "}
                    {/* Added text color to icon */}
                    {news.date}
                  </div>
                  <CardTitle className="text-xl font-semibold line-clamp-2 text-gray-900 dark:text-white">
                    {news.title}
                  </CardTitle>{" "}
                  {/* Larger, bolder title */}
                </CardHeader>
                <CardContent className="pt-0">
                  {" "}
                  {/* Adjusted padding */}
                  <p className="text-gray-600 dark:text-gray-300 text-base line-clamp-3 mb-4 leading-relaxed">
                    {news.excerpt}
                  </p>{" "}
                  {/* Adjusted text size and line height */}
                  <Link href="/auth/login">
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 text-[#81B214] hover:text-[#50B003] font-semibold"
                    >
                      {" "}
                      {/* Changed to link variant, bolder */}
                      อ่านต่อ
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#81B214] to-[#50B003] text-white">
        {" "}
        {/* Ensured text is white */}
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            พร้อมเข้าร่วมเครือข่ายศิษย์เก่า ส.เภสัชศาสตร์แล้วหรือยัง?
          </h2>{" "}
          {/* Bolder title */}
          <p className="text-xl text-blue-100 dark:text-blue-200 mb-10 leading-relaxed">
            เข้าสู่ระบบเพื่อเชื่อมต่อกับศิษย์เก่าและเข้าถึงฟีเจอร์ทั้งหมด
          </p>{" "}
          {/* Increased spacing, relaxed leading */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/login">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto rounded-lg text-lg font-semibold bg-white dark:bg-gray-900 text-[#81B214] hover:bg-green-50 dark:hover:bg-gray-800  transition-colors"
              >
                {" "}
                {/* Enhanced secondary button */}
                <Mail className="mr-2 h-5 w-5" />
                เข้าสู่ระบบด้วย Google
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto rounded-lg text-lg font-semibold bg-white dark:bg-gray-900 text-[#81B214] hover:bg-green-50 dark:hover:bg-gray-800 transition-colors"
              >
                {" "}
                {/* Enhanced secondary button */}
                <Facebook className="mr-2 h-5 w-5" />
                เข้าสู่ระบบด้วย Facebook
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {" "}
            {/* Increased gap */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">เครือข่ายศิษย์เก่า</h3>
              <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                {" "}
                {/* Increased spacing, relaxed leading */}
                เชื่อมต่อศิษย์เก่าทั่วประเทศ สร้างเครือข่ายวิชาชีพที่แข็งแกร่ง
                และร่วมพัฒนาวงการเภสัชกรรมไทย
              </p>
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-300 hover:text-white hover:bg-gray-800 dark:hover:bg-gray-900 rounded-full transition-colors"
                >
                  {" "}
                  {/* Changed to icon size, rounded, hover effect */}
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-300 hover:text-white hover:bg-gray-800 dark:hover:bg-gray-900 rounded-full transition-colors"
                >
                  {" "}
                  {/* Changed to icon size, rounded, hover effect */}
                  <Mail className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-5">เมนูหลัก</h4>{" "}
              {/* Increased spacing */}
              <ul className="space-y-3 text-gray-300">
                {" "}
                {/* Increased spacing */}
                <li>
                  <Link
                    href="/auth/login"
                    className="hover:text-white transition-colors text-base"
                  >
                    {" "}
                    {/* Larger text */}
                    ข้อมูลศิษย์เก่า
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/login"
                    className="hover:text-white transition-colors text-base"
                  >
                    แผนที่เภสัชกร
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/login"
                    className="hover:text-white transition-colors text-base"
                  >
                    ข่าวสารศิษย์เก่า
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/login"
                    className="hover:text-white transition-colors text-base"
                  >
                    เว็บบอร์ดวิชาชีพ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-5">ติดต่อเรา</h4>{" "}
              {/* Increased spacing */}
              <ul className="space-y-3 text-gray-300">
                {" "}
                {/* Increased spacing */}
                <li className="flex items-center text-base">
                  {" "}
                  {/* Larger text */}
                  <Phone className="mr-2 h-4 w-4 text-gray-400 dark:text-gray-500" />{" "}
                  {/* Added text color to icon */}
                  02-123-4567
                </li>
                <li className="flex items-center text-base">
                  {" "}
                  {/* Larger text */}
                  <Mail className="mr-2 h-4 w-4 text-gray-400 dark:text-gray-500" />{" "}
                  {/* Added text color to icon */}
                  pharmacy@wu.ac.th
                </li>
                <li className="flex items-start text-base">
                  {" "}
                  {/* Larger text */}
                  <MapIcon className="mr-2 h-4 w-4 mt-1 text-gray-400 dark:text-gray-500" />{" "}
                  {/* Added text color to icon */}
                  <span>
                    สำนักเภสัชศาสตร์ มหาวิทยาลัยวลัยลักษณ์
                    <br />
                    จังหวัดนครศรีธรรมราช 80160
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 dark:border-gray-900 mt-10 pt-8 text-center text-gray-400">
            {" "}
            {/* Increased spacing */}
            <p>
              &copy; 2025 ระบบเครือข่ายศิษย์เก่า สำนักเภสัชศาสตร์
              มหาวิทยาลัยวลัยลักษณ์. สงวนลิขสิทธิ์.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
