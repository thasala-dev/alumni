"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Calendar,
  GraduationCap,
  Phone,
  Mail,
  MessageCircle,
  Facebook,
  Linkedin,
  User,
  Building,
  Heart,
  Share2,
  MoreHorizontal,
  Edit,
  Flag,
} from "lucide-react";
import { AdmitYear } from "@/lib/utils";


export default function AlumniDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [alumni, setAlumni] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const loadAlumniProfile = async () => {
      setLoading(true);
      const alumniId = params.id as string;
      try {
        const res = await fetch(`/api/alumniProfile?id=${alumniId}`);
        if (res.ok) {
          const data = await res.json();
          setAlumni(data);
        } else {
          setAlumni(null);
        }
      } catch (e) {
        setAlumni(null);
      }
      setLoading(false);
    };
    loadAlumniProfile();
  }, [params.id]);

  const handleBack = () => {
    router.back();
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      if (navigator.share && alumni) {
        navigator.share({
          title: `โปรไฟล์ ${alumni.first_name} ${alumni.last_name}`,
          text: `ดูโปรไฟล์ของ ${alumni.first_name} ${alumni.last_name} - ${alumni.major} รุ่น ${alumni.graduation_year}`,
          url: window.location.href,
        });
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href);
        alert("ลิงก์ถูกคัดลอกแล้ว!");
      }
    }
  };

  const handleContact = (type: string, value?: string) => {
    if (typeof window !== "undefined") {
      switch (type) {
        case "email":
          window.open(`mailto:${alumni?.email}`);
          break;
        case "phone":
          window.open(`tel:${value}`);
          break;
        case "line":
          window.open(`https://line.me/ti/p/~${value}`);
          break;
        case "facebook":
          window.open(value);
          break;
        case "linkedin":
          window.open(value);
          break;
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
          <div className="space-y-6">
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!alumni) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-6xl">😕</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          ไม่พบข้อมูลศิษย์เก่า
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          ขออภัย เราไม่พบข้อมูลศิษย์เก่าที่คุณต้องการ
        </p>
        <Button onClick={handleBack} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          กลับไปหน้าศิษย์เก่า
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Header Card */}
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="relative">
                  <Avatar className="h-32 w-32 ring-0 ring-[#81B214] dark:ring-gray-700 shadow-lg">
                    <AvatarImage
                      src={alumni.profile_image_url}
                      alt={`${alumni.first_name} ${alumni.last_name}`}
                    />
                    <AvatarFallback className="bg-gradient-to-r from-[#81B214]/10 to-[#50B003]/10 dark:from-[#81B214] dark:to-[#50B003] text-[#81B214] dark:text-white text-4xl font-semibold">
                      {alumni.first_name.charAt(0)}
                      {alumni.last_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {alumni.is_verified && (
                    <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white rounded-full p-2 shadow-lg">
                      <GraduationCap className="h-4 w-4" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {alumni.first_name} {alumni.last_name}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      "{alumni.nickname || alumni.first_name}"
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Badge
                      variant="secondary"
                      className="bg-[#81B214]/10 dark:bg-[#81B214] text-[#81B214] dark:text-white px-3 py-1"
                    >
                      <GraduationCap className="mr-1 h-3 w-3" />
                      {alumni.programname} รุ่นที่{" "}
                      {AdmitYear(alumni.admit_year)}
                    </Badge>
                    {alumni.current_company && (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1"
                      >
                        <Building className="mr-1 h-3 w-3" />
                        {alumni.current_position}
                      </Badge>
                    )}
                    {alumni.current_province && (
                      <Badge
                        variant="secondary"
                        className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-3 py-1"
                      >
                        <MapPin className="mr-1 h-3 w-3" />
                        {alumni.current_province}
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {alumni.email && (
                      <Button
                        size="sm"
                        onClick={() => handleContact("email")}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        ส่งอีเมล
                      </Button>
                    )}
                    {alumni.phone && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleContact("phone", alumni.phone)}
                      >
                        <Phone className="mr-2 h-4 w-4" />
                        โทร
                      </Button>
                    )}
                    {alumni.line_id && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleContact("line", alumni.line_id)}
                        className="text-green-600 hover:text-green-700 border-green-200 hover:border-green-300"
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Line
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About Section */}
          {alumni.bio && (
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-gray-200/50 dark:border-gray-700/50 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-t-lg">
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <User className="mr-2 h-5 w-5 text-blue-500" />
                  เกี่ยวกับฉัน
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {alumni.bio}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Achievements */}
          {alumni.achievements && alumni.achievements.length > 0 && (
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-gray-200/50 dark:border-gray-700/50 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 rounded-t-lg">
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <GraduationCap className="mr-2 h-5 w-5 text-yellow-500" />
                  ความสำเร็จและรางวัล
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {alumni.achievements.map(
                    (achievement: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                      >
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                        <span className="text-gray-700 dark:text-gray-300">
                          {achievement}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Interests */}
          {alumni.interests && alumni.interests.length > 0 && (
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-gray-200/50 dark:border-gray-700/50 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-t-lg">
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <Heart className="mr-2 h-5 w-5 text-purple-500" />
                  ความสนใจ
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2">
                  {alumni.interests.map((interest: any, index: number) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-3 py-1 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors cursor-pointer"
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-gray-200/50 dark:border-gray-700/50 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 rounded-t-lg">
              <CardTitle className="flex items-center text-gray-900 dark:text-white">
                <Mail className="mr-2 h-5 w-5 text-green-500" />
                ข้อมูลติดต่อ
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-3">
                {alumni.email && (
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        อีเมล
                      </p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {alumni.email}
                      </p>
                    </div>
                  </div>
                )}

                {alumni.phone && (
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        เบอร์โทรศัพท์
                      </p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {alumni.phone}
                      </p>
                    </div>
                  </div>
                )}

                {alumni.line_id && (
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <MessageCircle className="h-4 w-4 text-green-500" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Line ID
                      </p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {alumni.line_id}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  โซเชียลมีเดีย
                </h4>
                <div className="flex gap-2">
                  {alumni.facebook_url && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        handleContact("facebook", alumni.facebook_url)
                      }
                      className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300"
                    >
                      <Facebook className="h-4 w-4" />
                    </Button>
                  )}
                  {alumni.linkedin_url && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        handleContact("linkedin", alumni.linkedin_url)
                      }
                      className="text-blue-700 hover:text-blue-800 border-blue-200 hover:border-blue-300"
                    >
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work Information */}
          {alumni.current_company && (
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-gray-200/50 dark:border-gray-700/50 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-t-lg">
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <Briefcase className="mr-2 h-5 w-5 text-blue-500" />
                  ข้อมูลการทำงาน
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    บริษัท/องค์กร
                  </p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {alumni.current_company}
                  </p>
                </div>

                {alumni.current_position && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ตำแหน่ง
                    </p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {alumni.current_position}
                    </p>
                  </div>
                )}

                {alumni.current_province && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      จังหวัด
                    </p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {alumni.current_province}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Education Information */}
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-gray-200/50 dark:border-gray-700/50 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-t-lg">
              <CardTitle className="flex items-center text-gray-900 dark:text-white">
                <GraduationCap className="mr-2 h-5 w-5 text-purple-500" />
                ข้อมูลการศึกษา
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  สาขาวิชา
                </p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {alumni.programname}
                </p>
              </div>

              {/* <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ปีที่จบการศึกษา
                </p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {alumni.graduation_year}
                </p>
              </div> */}

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">คณะ</p>
                <p className="text-gray-900 dark:text-white font-medium">
                  คณะเภสัชศาสตร์
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  มหาวิทยาลัย
                </p>
                <p className="text-gray-900 dark:text-white font-medium">
                  มหาวิทยาลัยวลัยลักษณ์
                </p>
              </div>

              {alumni.joined_date && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    เข้าร่วมเครือข่าย
                  </p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {new Date(alumni.joined_date).toLocaleDateString("th-TH", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
