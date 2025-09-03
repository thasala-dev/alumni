"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  GraduationCap,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { AdmitYear } from "@/lib/utils";

// Removed: import { supabase, isSupabaseConfigured } from "@/lib/supabase"

interface AlumniProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  nickname: string;
  admit_year: number;
  programname: string;
  current_work: {
    company_name: string;
    position: string;
    province: string;
  };
  profile_image_url?: string;
}

export default function AlumniPage() {
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [loading, setLoading] = useState(true); // Start loading to simulate fetch
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/alumniProfile");
        if (res.ok) {
          const data = await res.json();
          setAlumni(data);
        } else {
          setAlumni([]);
        }
      } catch (e) {
        setAlumni([]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredAlumni = alumni.filter((person) => {
    const matchesSearch =
      person.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (person.nickname &&
        person.nickname.toLowerCase().includes(searchTerm.toLowerCase())) ||
      person.programname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.current_work?.company_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesProvince =
      !selectedProvince || person.current_work?.province === selectedProvince;
    const matchesYear =
      !selectedYear || person.admit_year.toString() === selectedYear;

    return matchesSearch && matchesProvince && matchesYear;
  });

  const provinces = [
    ...new Set(alumni.map((person) => person.current_work?.province || "")),
  ].filter(Boolean);
  const graduationYears = [
    ...new Set(alumni.map((person) => person.admit_year)),
  ].sort((a, b) => b - a);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/4 mb-8"></div>
          {/* Larger placeholder for title */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Placeholder for filters */}
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      {/* Increased overall spacing */}
      <div>
        <h1 className="text-3xl font-bold text-[#81B214]">ข้อมูลศิษย์เก่า</h1>
        {/* Bolder title */}
        <p className="text-lg text-gray-600 dark:text-gray-400">
          รายชื่อและข้อมูลศิษย์เก่าทั้งหมด (ข้อมูลตัวอย่าง)
        </p>
        {/* Larger text */}
      </div>
      {/* Search and Filter */}
      <Card className="shadow-md rounded-xl bg-white dark:bg-gray-900/80 border-gray-200 dark:border-gray-700">
        {/* Added shadow and rounded corners */}
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              {/* Centered icon */}
              <Input
                placeholder="ค้นหาชื่อ นามสกุล สถานที่ทำงาน ตำแหน่งงาน"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-lg focus-visible:ring-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>
            <Select
              value={selectedProvince}
              onValueChange={setSelectedProvince}
            >
              <SelectTrigger className="w-full rounded-lg focus-visible:ring-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                {/* Rounded corners, consistent focus ring */}
                <SelectValue placeholder="ทุกจังหวัด" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-900/80 border-gray-200 dark:border-gray-700">
                <SelectItem
                  value="all"
                  className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  ทุกจังหวัด
                </SelectItem>
                {provinces.map((province) => (
                  <SelectItem
                    key={province}
                    value={province}
                    className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-full rounded-lg focus-visible:ring-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                {/* Rounded corners, consistent focus ring */}
                <SelectValue placeholder="ทุกรุ่น" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-900/80 border-gray-200 dark:border-gray-700">
                <SelectItem
                  value="all"
                  className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  ทุกรุ่น
                </SelectItem>
                {graduationYears.map((year) => (
                  <SelectItem
                    key={year}
                    value={year.toString()}
                    className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    รุ่นที่ {AdmitYear(year)} ({year})
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
              className="rounded-lg border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <Filter className="mr-2 h-4 w-4" />
              ล้างตัวกรอง
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Results Summary */}
      <div className="flex items-center justify-between py-2">
        {/* Added vertical padding */}
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <span className="text-base text-gray-700 dark:text-gray-300">
            {/* Larger text */}
            แสดง {filteredAlumni.length} จาก {alumni.length} คน
          </span>
        </div>
      </div>
      {/* Alumni Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAlumni.map((person: any) => (
          <Card
            key={person.id}
            className="shadow-md hover:shadow-xl transition-shadow duration-300 rounded-xl dark:bg-gray-900/80 dark:border-gray-700 dark:hover:shadow-gray-900/20"
          >
            {/* Enhanced shadow and hover */}
            <CardContent className="p-4">
              <div className="flex items-start space-x-4 mb-4">
                {/* Adjusted spacing */}
                <Avatar className="h-14 w-14">
                  {/* Larger avatar */}
                  <AvatarImage src={person.profile_image_url} />
                  {/* Added query to placeholder */}
                  <AvatarFallback className="bg-[#81B214]/10 dark:bg-[#81B214] text-[#81B214] dark:text-white text-2xl font-semibold">
                    {/* Larger fallback text */}
                    {person.first_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 pt-1">
                  {/* Adjusted padding */}
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 truncate mb-0.5">
                    {/* Larger, bolder title */}
                    {person.first_name} {person.last_name}
                  </h3>
                  <p className="text-base text-gray-500 dark:text-gray-400">
                    ({person.nickname || person.first_name})
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {/* Increased spacing */}
                <div className="flex items-center text-base text-gray-700 dark:text-gray-300">
                  {/* Larger text */}
                  <GraduationCap className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  {/* Added text color to icon */}
                  รุ่นที่ {AdmitYear(person.admit_year)} {person.programname}
                </div>
                <div className="flex items-center text-base text-gray-700 dark:text-gray-300">
                  {/* Larger text */}
                  <Briefcase className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  {/* Added text color to icon */}
                  <div className="truncate">
                    <div className="font-medium">
                      {person.current_position || "-"}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {person.current_company}
                    </div>
                    {/* Adjusted text size */}
                  </div>
                </div>
                <div className="flex items-center text-base text-gray-700 dark:text-gray-300">
                  {/* Larger text */}
                  <MapPin className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  {/* Added text color to icon */}
                  {person.current_province || "-"}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                {/* Increased spacing, added border color */}
                <Link href={`/dashboard/alumni/${person.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent rounded-lg border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 dark:text-gray-200 transition-colors"
                  >
                    {/* Enhanced outline button */}
                    ดูรายละเอียด
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {filteredAlumni.length === 0 && (
        <Card className="shadow-md rounded-xl dark:bg-gray-900/80 dark:border-gray-700">
          {/* Added shadow and rounded corners */}
          <CardContent className="p-12 text-center">
            <Users className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-6" />
            {/* Larger icon, increased spacing */}
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              ไม่พบข้อมูลศิษย์เก่า
            </h3>
            {/* Larger, bolder title */}
            <p className="text-gray-600 dark:text-gray-400 text-base">
              ลองเปลี่ยนเงื่อนไขการค้นหาหรือตัวกรอง
            </p>
            {/* Larger text */}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
