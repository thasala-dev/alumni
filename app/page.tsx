"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { MapOverview } from "@/components/map-overview"; // Import the new MapOverview component

export default function HomePage() {
  const [stats, setStats] = useState({
    totalAlumni: 1247,
    totalNews: 45,
    totalDiscussions: 156,
    provinces: 25,
  });

  const features = [
    {
      icon: Users,
      title: "เครือข่ายศิษย์เก่า",
      description:
        "เชื่อมต่อกับเพื่อนศิษย์เก่าทั่วประเทศ ค้นหาและติดต่อได้ง่าย",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: MapPin,
      title: "แผนที่การกระจายตัว",
      description: "ดูการกระจายตัวของศิษย์เก่าตามจังหวัดและภูมิภาค",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Newspaper,
      title: "ข่าวสารและกิจกรรม",
      description: "อัปเดตข่าวสาร กิจกรรม และประกาศต่างๆ จากสมาคม",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: MessageSquare,
      title: "เว็บบอร์ดสนทนา",
      description: "แลกเปลี่ยนความคิดเห็น ประสบการณ์ และความรู้",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const recentNews = [
    {
      id: 1,
      title: "ประกาศการจัดงานสังสรรค์ศิษย์เก่าประจำปี 2024",
      date: "15 มกราคม 2567",
      excerpt:
        "เชิญร่วมงานสังสรรค์ศิษย์เก่าประจำปี 2024 ในวันเสาร์ที่ 15 มิถุนายน 2024...",
    },
    {
      id: 2,
      title: "เปิดรับสมัครทุนการศึกษาสำหรับบุตรศิษย์เก่า",
      date: "10 มกราคม 2567",
      excerpt:
        "สมาคมศิษย์เก่าขอประกาศเปิดรับสมัครทุนการศึกษาสำหรับบุตรศิษย์เก่า...",
    },
    {
      id: 3,
      title: "ผลการประชุมคณะกรรมการสมาคมศิษย์เก่า ครั้งที่ 1/2567",
      date: "5 มกราคม 2567",
      excerpt:
        "สรุปผลการประชุมคณะกรรมการสมาคมศิษย์เก่า เรื่องแผนงานประจำปี 2567...",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Decorative blurred shape */}
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200 rounded-full blur-3xl opacity-40 animate-pulse z-0"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-gradient-to-tr from-pink-200 via-blue-100 to-indigo-100 rounded-full blur-3xl opacity-30 animate-pulse z-0"
          aria-hidden="true"
        />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="mb-10">
            <Badge
              variant="secondary"
              className="mb-4 px-5 py-2 text-base rounded-full shadow-md bg-white/80 backdrop-blur border border-blue-100 animate-fade-in"
            >
              เชื่อมต่อ • แลกเปลี่ยน • เติบโต
            </Badge>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight drop-shadow-lg animate-fade-in-up">
              เครือข่าย
              <span className="text-blue-600"> ศิษย์เก่า</span>
              <br />
              ที่แข็งแกร่ง
            </h1>
            <p className="text-2xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-100">
              เชื่อมต่อกับเพื่อนศิษย์เก่าทั่วประเทศ แลกเปลี่ยนประสบการณ์
              และร่วมสร้างอนาคตที่ดีกว่าไปด้วยกัน
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-200">
              <Link href="/auth/login">
                <Button
                  size="lg"
                  className="w-full sm:w-auto rounded-xl text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg transition-all duration-200 scale-100 hover:scale-105"
                >
                  เข้าสู่ระบบ
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-white/80 rounded-xl text-xl font-bold border-gray-300 hover:border-blue-500 hover:text-blue-600 shadow transition-all duration-200 scale-100 hover:scale-105"
              >
                เรียนรู้เพิ่มเติม
              </Button>
            </div>
          </div>
          {/* Divider */}
          <div className="w-full flex justify-center my-12 animate-fade-in-up delay-300">
            <div className="h-1 w-40 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-full opacity-60" />
          </div>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mt-10 animate-fade-in-up delay-400">
            <div className="text-center group transition-all">
              <div className="text-5xl md:text-6xl font-extrabold text-blue-600 mb-2 drop-shadow group-hover:scale-110 transition-transform duration-200">
                {stats.totalAlumni.toLocaleString()}
              </div>
              <div className="text-gray-700 text-lg font-medium">ศิษย์เก่า</div>
            </div>
            <div className="text-center group transition-all">
              <div className="text-5xl md:text-6xl font-extrabold text-green-600 mb-2 drop-shadow group-hover:scale-110 transition-transform duration-200">
                {stats.provinces}
              </div>
              <div className="text-gray-700 text-lg font-medium">จังหวัด</div>
            </div>
            <div className="text-center group transition-all">
              <div className="text-5xl md:text-6xl font-extrabold text-purple-600 mb-2 drop-shadow group-hover:scale-110 transition-transform duration-200">
                {stats.totalNews}
              </div>
              <div className="text-gray-700 text-lg font-medium">ข่าวสาร</div>
            </div>
            <div className="text-center group transition-all">
              <div className="text-5xl md:text-6xl font-extrabold text-orange-500 mb-2 drop-shadow group-hover:scale-110 transition-transform duration-200">
                {stats.totalDiscussions}
              </div>
              <div className="text-gray-700 text-lg font-medium">กระทู้</div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Overview Section */}
      <section className="py-20 bg-gray-50">
        {" "}
        {/* Changed background to gray-50 for contrast */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MapOverview />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              ฟีเจอร์หลัก
            </h2>{" "}
            {/* Bolder title */}
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              ระบบจัดการศิษย์เก่าที่ครบครันและใช้งานง่าย
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {" "}
            {/* Increased gap */}
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center shadow-md hover:shadow-xl transition-shadow duration-300 rounded-xl"
              >
                {" "}
                {/* Enhanced shadow and hover */}
                <CardContent className="p-8">
                  {" "}
                  {/* Increased padding */}
                  <div
                    className={`inline-flex p-4 rounded-full ${feature.bgColor} mb-6 shadow-sm`}
                  >
                    {" "}
                    {/* Larger padding, added shadow */}
                    <feature.icon className={`h-7 w-7 ${feature.color}`} />{" "}
                    {/* Larger icon */}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>{" "}
                  {/* Larger title */}
                  <p className="text-gray-600 text-base leading-relaxed">
                    {feature.description}
                  </p>{" "}
                  {/* Adjusted text size and line height */}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent News Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
            {" "}
            {/* Adjusted for responsiveness */}
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                ข่าวสารล่าสุด
              </h2>
              <p className="text-lg text-gray-600">
                อัปเดตข่าวสารและกิจกรรมจากสมาคม
              </p>
            </div>
            <Link href="/auth/login">
              <Button
                variant="outline"
                className="rounded-lg border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-colors"
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
                className="shadow-md hover:shadow-xl transition-shadow duration-300 rounded-xl"
              >
                {" "}
                {/* Enhanced shadow and hover */}
                <CardHeader className="pb-4">
                  {" "}
                  {/* Adjusted padding */}
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar className="mr-2 h-4 w-4 text-gray-400" />{" "}
                    {/* Added text color to icon */}
                    {news.date}
                  </div>
                  <CardTitle className="text-xl font-semibold line-clamp-2 text-gray-900">
                    {news.title}
                  </CardTitle>{" "}
                  {/* Larger, bolder title */}
                </CardHeader>
                <CardContent className="pt-0">
                  {" "}
                  {/* Adjusted padding */}
                  <p className="text-gray-600 text-base line-clamp-3 mb-4 leading-relaxed">
                    {news.excerpt}
                  </p>{" "}
                  {/* Adjusted text size and line height */}
                  <Link href="/auth/login">
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 text-blue-600 hover:text-blue-700 font-semibold"
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
      <section className="py-20 bg-blue-600 text-white">
        {" "}
        {/* Ensured text is white */}
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            พร้อมเข้าร่วมเครือข่ายแล้วหรือยัง?
          </h2>{" "}
          {/* Bolder title */}
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            เข้าสู่ระบบเพื่อเชื่อมต่อกับเพื่อนศิษย์เก่าและเข้าถึงฟีเจอร์ทั้งหมด
          </p>{" "}
          {/* Increased spacing, relaxed leading */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/login">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto rounded-lg text-lg font-semibold bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
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
                className="w-full sm:w-auto rounded-lg text-lg font-semibold bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
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
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {" "}
            {/* Increased gap */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">ระบบศิษย์เก่า</h3>
              <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                {" "}
                {/* Increased spacing, relaxed leading */}
                เชื่อมต่อศิษย์เก่าทั่วประเทศ สร้างเครือข่ายที่แข็งแกร่ง
                และร่วมพัฒนาสังคมไปด้วยกัน
              </p>
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-300 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
                >
                  {" "}
                  {/* Changed to icon size, rounded, hover effect */}
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-300 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
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
                    แผนที่
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/login"
                    className="hover:text-white transition-colors text-base"
                  >
                    ข่าวสาร
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/login"
                    className="hover:text-white transition-colors text-base"
                  >
                    เว็บบอร์ด
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
                  <Phone className="mr-2 h-4 w-4 text-gray-400" />{" "}
                  {/* Added text color to icon */}
                  02-123-4567
                </li>
                <li className="flex items-center text-base">
                  {" "}
                  {/* Larger text */}
                  <Mail className="mr-2 h-4 w-4 text-gray-400" />{" "}
                  {/* Added text color to icon */}
                  info@alumni.ac.th
                </li>
                <li className="flex items-start text-base">
                  {" "}
                  {/* Larger text */}
                  <MapIcon className="mr-2 h-4 w-4 mt-1 text-gray-400" />{" "}
                  {/* Added text color to icon */}
                  <span>
                    123 ถนนมหาวิทยาลัย
                    <br />
                    เขตราชเทวี กรุงเทพฯ 10400
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-10 pt-8 text-center text-gray-400">
            {" "}
            {/* Increased spacing */}
            <p>&copy; 2024 ระบบศิษย์เก่า. สงวนลิขสิทธิ์.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
