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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AlumniProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  nickname: string;
  graduation_year: number;
  major: string;
  bio?: string;
  current_company?: string;
  current_position?: string;
  current_province?: string;
  phone?: string;
  line_id?: string;
  facebook_url?: string;
  linkedin_url?: string;
  profile_image_url?: string;
  joined_date?: string;
  is_verified?: boolean;
  achievements?: string[];
  interests?: string[];
}

// Demo data for alumni profiles
const demoAlumniProfiles: { [key: string]: AlumniProfile } = {
  "1": {
    id: "1",
    email: "somchai@example.com",
    first_name: "สมชาย",
    last_name: "ใจดี",
    nickname: "ชาย",
    graduation_year: 2018,
    major: "เภสัชศาสตร์",
    bio: "เป็นเภสัชกรที่มีประสบการณ์ในการทำงานด้านเภสัชกรรมชุมชนมาเป็นเวลา 5 ปี มีความสนใจในการพัฒนาระบบการดูแลสุขภาพในชุมชนท้องถิ่น และการใช้เทคโนโลยีเพื่อปรับปรุงการให้บริการทางเภสัชกรรม",
    current_company: "โรงพยาบาลสงขลา",
    current_position: "เภสัชกร",
    current_province: "สงขลา",
    phone: "081-234-5678",
    line_id: "somchai_pharmacy",
    facebook_url: "https://facebook.com/somchai.jaided",
    linkedin_url: "https://linkedin.com/in/somchai-jaided",
    profile_image_url: "/placeholder-user.jpg",
    joined_date: "2018-05-15",
    is_verified: true,
    achievements: [
      "เภสัชกรดีเด่นประจำปี 2022",
      "รางวัลนวัตกรรมเภสัชกรรมชุมชน",
      "ผู้นำการเปลี่ยนแปลงด้านสุขภาพดิจิทัล",
    ],
    interests: [
      "เภสัชกรรมชุมชน",
      "เทคโนโลยีสุขภาพ",
      "การพัฒนาชุมชน",
      "การวิจัยทางเภสัชศาสตร์",
    ],
  },
  "2": {
    id: "2",
    email: "malee@example.com",
    first_name: "มาลี",
    last_name: "สวยงาม",
    nickname: "มาลี",
    graduation_year: 2020,
    major: "เภสัชศาสตร์",
    bio: "เภสัชกรหญิงที่มีความหลงใหลในการวิจัยและพัฒนายาใหม่ ปัจจุบันทำงานในแผนกวิจัยและพัฒนาของบริษัทยาชั้นนำ มีประสบการณ์ในการพัฒนาผลิตภัณฑ์เสริมอาหารและยาสมุนไพร",
    current_company: "บริษัทเภสัชกรรมไทย จำกัด",
    current_position: "นักวิจัยและพัฒนา",
    current_province: "กรุงเทพมหานคร",
    phone: "089-876-5432",
    line_id: "malee_research",
    facebook_url: "https://facebook.com/malee.suayngam",
    profile_image_url: "/placeholder-user.jpg",
    joined_date: "2020-03-20",
    is_verified: true,
    achievements: [
      "นักวิจัยดีเด่นแห่งปี 2023",
      "สิทธิบัตรการประดิษฐ์ยาสมุนไพร 2 รายการ",
      "รางวัลนวัตกรรมเยาวชน",
    ],
    interests: [
      "การวิจัยและพัฒนายา",
      "ยาสมุนไพร",
      "เคมีเภสัช",
      "นวัตกรรมทางการแพทย์",
    ],
  },
  "3": {
    id: "3",
    email: "narong@example.com",
    first_name: "ณรงค์",
    last_name: "เก่งกาจ",
    nickname: "ณรงค์",
    graduation_year: 2015,
    major: "เภสัชศาสตร์",
    bio: "ผู้ประกอบการที่ประสบความสำเร็จในการเปิดร้านขายยาและเป็นเจ้าของเครือข่ายร้านยาในภาคใต้ มีวิสัยทัศน์ในการพัฒนาธุรกิจเภสัชกรรมให้ทันสมัยและเข้าถึงได้ง่าย",
    current_company: "เครือข่ายร้านยาณรงค์",
    current_position: "ผู้ก่อตั้งและประธานเจ้าหน้าที่บริหาร",
    current_province: "นครศรีธรรมราช",
    phone: "084-567-8901",
    line_id: "narong_pharmacy",
    facebook_url: "https://facebook.com/narong.kengkaj",
    linkedin_url: "https://linkedin.com/in/narong-kengkaj",
    profile_image_url: "/placeholder-user.jpg",
    joined_date: "2015-07-10",
    is_verified: true,
    achievements: [
      "ผู้ประกอบการดีเด่นประจำปี 2021",
      "รางวัลธุรกิจเภสัชกรรมยั่งยืน",
      "ผู้นำการเปลี่ยนแปลงทางธุรกิจ",
    ],
    interests: [
      "ธุรกิจเภสัชกรรม",
      "การจัดการธุรกิจ",
      "เทคโนโลジีทางการค้า",
      "การพัฒนาทีม",
    ],
  },
};

export default function AlumniDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [alumni, setAlumni] = useState<AlumniProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const loadAlumniProfile = async () => {
      setLoading(true);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const alumniId = params.id as string;
      const profile = demoAlumniProfiles[alumniId];

      if (profile) {
        setAlumni(profile);
      }

      setLoading(false);
    };

    loadAlumniProfile();
  }, [params.id]);

  const handleBack = () => {
    router.back();
  };

  const handleShare = () => {
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
  };

  const handleContact = (type: string, value?: string) => {
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
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Header Card */}
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="relative">
                  <Avatar className="h-32 w-32 ring-4 ring-blue-100 dark:ring-gray-700 shadow-lg">
                    <AvatarImage
                      src={alumni.profile_image_url || "/placeholder-user.jpg"}
                      alt={`${alumni.first_name} ${alumni.last_name}`}
                    />
                    <AvatarFallback className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-600 dark:text-blue-400 text-4xl font-semibold">
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
                      "{alumni.nickname}"
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1"
                    >
                      <GraduationCap className="mr-1 h-3 w-3" />
                      {alumni.major} รุ่น {alumni.graduation_year}
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
                    <Button
                      size="sm"
                      onClick={() => handleContact("email")}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      ส่งอีเมล
                    </Button>
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
              <CardContent className="p-6">
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
              <CardContent className="p-6">
                <div className="space-y-3">
                  {alumni.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                    >
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                      <span className="text-gray-700 dark:text-gray-300">
                        {achievement}
                      </span>
                    </div>
                  ))}
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
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2">
                  {alumni.interests.map((interest, index) => (
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
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
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
              <CardContent className="p-6 space-y-4">
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
            <CardContent className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  สาขาวิชา
                </p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {alumni.major}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ปีที่จบการศึกษา
                </p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {alumni.graduation_year}
                </p>
              </div>

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
