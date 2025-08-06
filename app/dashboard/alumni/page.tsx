"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Filter,
  Users,
  MapPin,
  Briefcase,
  Calendar,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// Removed: import { supabase, isSupabaseConfigured } from "@/lib/supabase"

interface AlumniProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  nickname: string;
  graduation_year: number;
  major: string;
  current_work: {
    company_name: string;
    position: string;
    province: string;
  };
  profile_image_url?: string;
}

// isDemoMode is now always true as we are using mock data
const isDemoMode = true;

// Demo data
const demoAlumni: AlumniProfile[] = [
  {
    id: "1",
    email: "somchai@example.com",
    first_name: "สมชาย",
    last_name: "ใจดี",
    nickname: "ชาย",
    graduation_year: 2018,
    major: "วิศวกรรมคอมพิวเตอร์",
    current_work: {
      company_name: "บริษัท เทคโนโลยี จำกัด",
      position: "Software Engineer",
      province: "กรุงเทพมหานคร",
    },
  },
  {
    id: "2",
    email: "malee@example.com",
    first_name: "มาลี",
    last_name: "สวยงาม",
    nickname: "มาลี",
    graduation_year: 2019,
    major: "บริหารธุรกิจ",
    current_work: {
      company_name: "บริษัท การเงิน จำกัด",
      position: "Business Analyst",
      province: "เชียงใหม่",
    },
  },
  {
    id: "3",
    email: "kamon@example.com",
    first_name: "กมล",
    last_name: "ทำดี",
    nickname: "กมล",
    graduation_year: 2020,
    major: "การตลาด",
    current_work: {
      company_name: "บริษัท โฆษณา จำกัด",
      position: "Marketing Manager",
      province: "ขอนแก่น",
    },
  },
  {
    id: "4",
    email: "somsak@example.com",
    first_name: "สมศักดิ์",
    last_name: "เก่งมาก",
    nickname: "ศักดิ์",
    graduation_year: 2017,
    major: "วิทยาการคอมพิวเตอร์",
    current_work: {
      company_name: "ธนาคารไทย",
      position: "Data Scientist",
      province: "กรุงเทพมหานคร",
    },
  },
  {
    id: "5",
    email: "pornchai@example.com",
    first_name: "พรชัย",
    last_name: "มีสุข",
    nickname: "ชัย",
    graduation_year: 2015,
    major: "วิศวกรรมโยธา",
    current_work: {
      company_name: "บริษัท ก่อสร้าง จำกัด",
      position: "Project Engineer",
      province: "ชลบุรี",
    },
  },
  {
    id: "6",
    email: "supaporn@example.com",
    first_name: "สุภาพร",
    last_name: "ใจดี",
    nickname: "พร",
    graduation_year: 2021,
    major: "นิเทศศาสตร์",
    current_work: {
      company_name: "สถานีโทรทัศน์",
      position: "Content Creator",
      province: "กรุงเทพมหานคร",
    },
  },
];

export default function AlumniPage() {
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [loading, setLoading] = useState(true); // Start loading to simulate fetch
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    // Simulate data fetching
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      setAlumni(demoAlumni);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredAlumni = alumni.filter((person) => {
    const matchesSearch =
      person.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.major.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.current_work.company_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesProvince =
      !selectedProvince || person.current_work.province === selectedProvince;
    const matchesYear =
      !selectedYear || person.graduation_year.toString() === selectedYear;

    return matchesSearch && matchesProvince && matchesYear;
  });

  const provinces = [
    ...new Set(demoAlumni.map((person) => person.current_work.province)),
  ].filter(Boolean);
  const graduationYears = [
    ...new Set(demoAlumni.map((person) => person.graduation_year)),
  ].sort((a, b) => b - a);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/4 mb-8"></div>{" "}
          {/* Larger placeholder for title */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {" "}
            {/* Placeholder for filters */}
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {" "}
      {/* Increased overall spacing */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">
          ข้อมูลศิษย์เก่า
        </h1>{" "}
        {/* Bolder title */}
        <p className="text-lg text-gray-600">
          รายชื่อและข้อมูลศิษย์เก่าทั้งหมด (ข้อมูลตัวอย่าง)
        </p>{" "}
        {/* Larger text */}
      </div>
      {/* Search and Filter */}
      <Card className="shadow-md rounded-xl">
        {" "}
        {/* Added shadow and rounded corners */}
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />{" "}
              {/* Centered icon */}
              <Input
                placeholder="ค้นหาชื่อ, สาขา, บริษัท..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-lg focus-visible:ring-blue-500"
              />
            </div>
            <Select
              value={selectedProvince}
              onValueChange={setSelectedProvince}
            >
              <SelectTrigger className="rounded-lg focus-visible:ring-blue-500">
                {" "}
                {/* Rounded corners, consistent focus ring */}
                <SelectValue placeholder="ทุกจังหวัด" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกจังหวัด</SelectItem>
                {provinces.map((province) => (
                  <SelectItem key={province} value={province}>
                    {province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="rounded-lg focus-visible:ring-blue-500">
                {" "}
                {/* Rounded corners, consistent focus ring */}
                <SelectValue placeholder="ทุกรุ่น" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกรุ่น</SelectItem>
                {graduationYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    รุ่น {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedProvince("");
                setSelectedYear("");
              }}
              className="rounded-lg border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-colors"
            >
              <Filter className="mr-2 h-4 w-4" />
              ล้างตัวกรอง
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Results Summary */}
      <div className="flex items-center justify-between py-2">
        {" "}
        {/* Added vertical padding */}
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-gray-500" />
          <span className="text-base text-gray-700">
            {" "}
            {/* Larger text */}
            แสดง {filteredAlumni.length} จาก {alumni.length} คน
          </span>
        </div>
      </div>
      {/* Alumni Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlumni.map((person) => (
          <Card
            key={person.id}
            className="shadow-md hover:shadow-xl transition-shadow duration-300 rounded-xl\"
          >
            {" "}
            {/* Enhanced shadow and hover */}
            <CardContent className="p-6">
              <div className="flex items-start space-x-4 mb-4">
                {" "}
                {/* Adjusted spacing */}
                <Avatar className="h-20 w-20">
                  {" "}
                  {/* Larger avatar */}
                  <AvatarImage
                    src={
                      person.profile_image_url ||
                      "/placeholder.svg?height=80&width=80&query=alumni profile"
                    }
                  />{" "}
                  {/* Added query to placeholder */}
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl font-semibold">
                    {" "}
                    {/* Larger fallback text */}
                    {person.first_name.charAt(0)}
                    {person.last_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 pt-1">
                  {" "}
                  {/* Adjusted padding */}
                  <h3 className="text-xl font-semibold text-gray-900 truncate mb-0.5">
                    {" "}
                    {/* Larger, bolder title */}
                    {person.first_name} {person.last_name}
                  </h3>
                  <p className="text-base text-gray-500">({person.nickname})</p>{" "}
                  {/* Larger text */}
                  <Badge
                    variant="secondary"
                    className="mt-2 px-3 py-1 text-sm rounded-full"
                  >
                    {" "}
                    {/* Enhanced badge styling */}
                    รุ่น {person.graduation_year}
                  </Badge>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {" "}
                {/* Increased spacing */}
                <div className="flex items-center text-base text-gray-700">
                  {" "}
                  {/* Larger text */}
                  <Calendar className="mr-2 h-4 w-4 text-gray-500" />{" "}
                  {/* Added text color to icon */}
                  {person.major}
                </div>
                <div className="flex items-center text-base text-gray-700">
                  {" "}
                  {/* Larger text */}
                  <Briefcase className="mr-2 h-4 w-4 text-gray-500" />{" "}
                  {/* Added text color to icon */}
                  <div className="truncate">
                    <div className="font-medium">
                      {person.current_work.position}
                    </div>
                    <div className="text-sm text-gray-600">
                      {person.current_work.company_name}
                    </div>{" "}
                    {/* Adjusted text size */}
                  </div>
                </div>
                <div className="flex items-center text-base text-gray-700">
                  {" "}
                  {/* Larger text */}
                  <MapPin className="mr-2 h-4 w-4 text-gray-500" />{" "}
                  {/* Added text color to icon */}
                  {person.current_work.province}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                {" "}
                {/* Increased spacing, added border color */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent rounded-lg border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-colors"
                >
                  {" "}
                  {/* Enhanced outline button */}
                  ดูรายละเอียด
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {filteredAlumni.length === 0 && (
        <Card className="shadow-md rounded-xl">
          {" "}
          {/* Added shadow and rounded corners */}
          <CardContent className="p-12 text-center">
            <Users className="mx-auto h-16 w-16 text-gray-400 mb-6" />{" "}
            {/* Larger icon, increased spacing */}
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              ไม่พบข้อมูลศิษย์เก่า
            </h3>{" "}
            {/* Larger, bolder title */}
            <p className="text-gray-600 text-base">
              ลองเปลี่ยนเงื่อนไขการค้นหาหรือตัวกรอง
            </p>{" "}
            {/* Larger text */}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
