"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ProvincePositions } from "@/data/thailand-province";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Camera,
  Save,
  Bell,
  Lock,
  Mail,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import LocationMap from "@/components/location-map-direct";

const demoPrivacySettings: any = {
  profile_privacy: "alumni_only",
  personal_privacy: "alumni_only",
  work_privacy: "public",
  contact_privacy: "alumni_only",
};

const demoNotificationSettings: any = {
  email_notifications: true,
  discussion_replies: true,
  news_updates: true,
  birthday_reminders: false,
};

export default function SettingsPage() {
  const { user, isLoading, isLoggedIn } = useAuth();
  const [tab, setTab] = useState<string>("profile");

  // Helper function to get province name from code
  const getProvinceName = (provinceCode: string) => {
    if (!provinceCode) return "";
    const province =
      ProvincePositions[provinceCode as keyof typeof ProvincePositions];
    return province ? province.name : provinceCode;
  };

  const [profile, setProfile] = useState<any>({
    id: "",
    email: "",
    first_name: "",
    last_name: "",
    nickname: "",
    profile_image_url: "",
    bio: "",
    graduation_year: "",
    major: "",
    phone: "",
    line_id: "",
    facebook_url: "",
    linkedin_url: "",
    current_company: "",
    current_position: "",
    current_province: "",
    latitude: "",
    longitude: "",
  });
  const [privacy, setPrivacy] = useState<any>(demoPrivacySettings);
  const [notifications, setNotifications] = useState<any>(
    demoNotificationSettings
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoading && user) {
      console.log("User is logged in:", user);
      fetchProfile();
    }
  }, [isLoading, user]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      // Fetch profile data
      const res = await fetch("/api/alumniProfile?user_id=" + user?.id);
      const data = await res.json();

      if (!data) {
        setIsAdmin(true);
      } else {
        setProfile(data);

        // Set privacy settings from profile data
        setPrivacy({
          profile_privacy: data.profile_privacy || "alumni_only",
          personal_privacy: data.personal_privacy || "alumni_only",
          work_privacy: data.work_privacy || "public",
          contact_privacy: data.contact_privacy || "alumni_only",
        });

        // Fetch notification settings
        try {
          const notificationRes = await fetch(
            "/api/notification-settings?user_id=" + user?.id
          );
          if (notificationRes.ok) {
            const notificationData = await notificationRes.json();
            setNotifications(notificationData);
          }
        } catch (error) {
          console.warn("Error fetching notification settings:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching alumni profiles:", error);
    }
    setLoading(false);
  };

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setProfile((prev: any) => ({ ...prev, [id]: value }));
  };

  const handlePrivacyChange = (key: any, value: any) => {
    setPrivacy((prev: any) => ({ ...prev, [key]: value }));
    // Also update the profile state so it can be saved together
    setProfile((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleNotificationChange = (key: any, checked: boolean) => {
    setNotifications((prev: any) => ({ ...prev, [key]: checked }));
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setSaveError(false);

    try {
      // Save profile data (includes privacy settings)
      const profileResponse = await fetch("/api/alumniProfile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      if (!profileResponse.ok) {
        const errorData = await profileResponse.json();
        throw new Error(
          `Failed to save profile data: ${errorData.error || "Unknown error"}`
        );
      }

      // Save notification settings
      const notificationResponse = await fetch("/api/notification-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user?.id,
          ...notifications,
        }),
      });

      if (!notificationResponse.ok) {
        console.warn("Failed to save notification settings");
      }

      console.log("Profile saved successfully:", profile);
      console.log("Notification settings:", notifications);

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);

      // Refresh profile data to ensure consistency
      await fetchProfile();
    } catch (error) {
      console.error("Error saving settings:", error);
      setSaveError(true);
      setTimeout(() => setSaveError(false), 3000);
    }

    setSaving(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-6">
            <Lock className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            ไม่สามารถเข้าถึงหน้าตั้งค่าได้
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            บัญชีของคุณไม่ใช่บัญชีศิษย์เก่า
            จึงไม่สามารถใช้งานหน้าตั้งค่าโปรไฟล์ได้
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#81B214]">ตั้งค่า</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          จัดการข้อมูลโปรไฟล์, ความเป็นส่วนตัว และการแจ้งเตือนของคุณ
        </p>
      </div>
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 mb-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg p-2">
        <button
          className={`px-6 py-3 font-medium rounded-lg transition-all duration-200 focus:outline-none transform hover:scale-105 ${
            tab === "profile"
              ? "bg-[#81B214] text-white shadow-lg shadow-[#81B214]/25"
              : "text-gray-600 dark:text-gray-300 hover:text-[#81B214] hover:bg-[#81B214]/10"
          }`}
          onClick={() => setTab("profile")}
        >
          ข้อมูลโปรไฟล์
        </button>
        <button
          className={`px-6 py-3 font-medium rounded-lg transition-all duration-200 focus:outline-none transform hover:scale-105 ${
            tab === "privacy"
              ? "bg-[#81B214] text-white shadow-lg shadow-[#81B214]/25"
              : "text-gray-600 dark:text-gray-300 hover:text-[#81B214] hover:bg-[#81B214]/10"
          }`}
          onClick={() => setTab("privacy")}
        >
          ความเป็นส่วนตัว
        </button>
        <button
          className={`px-6 py-3 font-medium rounded-lg transition-all duration-200 focus:outline-none transform hover:scale-105 ${
            tab === "notification"
              ? "bg-[#81B214] text-white shadow-lg shadow-[#81B214]/25"
              : "text-gray-600 dark:text-gray-300 hover:text-[#81B214] hover:bg-[#81B214]/10"
          }`}
          onClick={() => setTab("notification")}
        >
          การแจ้งเตือน
        </button>
      </div>

      {/* Tab Content */}
      {tab === "profile" && (
        <>
          {/* Profile Settings */}
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-t-lg">
              <CardTitle className="flex items-center text-gray-900 dark:text-white">
                <Mail className="mr-2 h-5 w-5 text-blue-500" />
                ข้อมูลโปรไฟล์
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                อัปเดตข้อมูลส่วนตัวและข้อมูลการศึกษาของคุณ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-4">
              {/* ...existing profile form... */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={profile.profile_image_url}
                      alt={`${profile.first_name} ${profile.last_name}`}
                    />
                    <AvatarFallback className="bg-[#81B214]/20 text-[#81B214] font-semibold text-3xl ">
                      {profile.first_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  {/* <Button
                    variant="outline"
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full bg-white dark:bg-gray-900/80 shadow-lg border-2 border-white dark:border-gray-700 hover:scale-110 transition-transform"
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        alert("อัปโหลดรูปภาพโปรไฟล์");
                      }
                    }}
                  >
                    <Camera className="h-4 w-4 text-blue-500" />
                    <span className="sr-only">อัปโหลดรูปภาพ</span>
                  </Button> */}
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {profile.title_name}
                    {profile.first_name} {profile.last_name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {profile.studentcode}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">ชื่อ</Label>
                  <Input
                    id="first_name"
                    value={profile.first_name ?? ""}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">นามสกุล</Label>
                  <Input
                    id="last_name"
                    value={profile.last_name ?? ""}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nickname">ชื่อเล่น</Label>
                  <Input
                    id="nickname"
                    value={profile.nickname ?? ""}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admit_year">ปีที่เข้าศึกษา</Label>
                  <Input
                    id="admit_year"
                    type="number"
                    value={profile.admit_year ?? ""}
                    onChange={handleProfileChange}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facultyname">สำนักวิชา</Label>
                  <Input
                    id="facultyname"
                    value={profile.facultyname ?? ""}
                    onChange={handleProfileChange}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="programname">หลักสูตร</Label>
                  <Input
                    id="programname"
                    value={profile.programname ?? ""}
                    onChange={handleProfileChange}
                    disabled
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">เกี่ยวกับฉัน</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio ?? ""}
                    onChange={handleProfileChange}
                    rows={4}
                  />
                </div>
              </div>

              <Separator />

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                ข้อมูลการทำงานปัจจุบัน
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current_company">ชื่อบริษัท</Label>
                    <Input
                      id="current_company"
                      value={profile.current_company ?? ""}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="current_position">ตำแหน่ง</Label>
                    <Input
                      id="current_position"
                      value={profile.current_position ?? ""}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="current_province">จังหวัดที่ทำงาน</Label>
                    <Input
                      id="current_province"
                      value={getProvinceName(profile.current_province) || ""}
                      placeholder="เลือกตำแหน่งบนแผนที่เพื่อกำหนดจังหวัด"
                      readOnly
                      className="bg-gray-50 dark:bg-gray-900"
                    />
                  </div>
                </div>
                <div>
                  <LocationMap
                    latitude={profile.latitude}
                    longitude={profile.longitude}
                    onLocationChange={(
                      lat,
                      lng,
                      provinceCode,
                      provinceName
                    ) => {
                      setProfile((prev: any) => ({
                        ...prev,
                        latitude: lat.toString(),
                        longitude: lng.toString(),
                        current_province: provinceCode || prev.current_province,
                      }));
                    }}
                    height="300px"
                    interactive={true}
                  />
                  <div className="mt-2 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor="latitude" className="text-xs">
                          ละติจูด (Latitude)
                        </Label>
                        <Input
                          id="latitude"
                          type="number"
                          step="any"
                          value={profile.latitude ?? ""}
                          onChange={handleProfileChange}
                          placeholder="13.7563"
                          className="text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="longitude" className="text-xs">
                          ลองติจูด (Longitude)
                        </Label>
                        <Input
                          id="longitude"
                          type="number"
                          step="any"
                          value={profile.longitude ?? ""}
                          onChange={handleProfileChange}
                          placeholder="100.5018"
                          className="text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                ข้อมูลติดต่อ
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                  <Input
                    id="phone"
                    value={profile.phone ?? ""}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="line_id">Line ID</Label>
                  <Input
                    id="line_id"
                    value={profile.line_id ?? ""}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebook_url">Facebook URL</Label>
                  <Input
                    id="facebook_url"
                    value={profile.facebook_url ?? ""}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                  <Input
                    id="linkedin_url"
                    value={profile.linkedin_url ?? ""}
                    onChange={handleProfileChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
      {tab === "privacy" && (
        <>
          {/* Privacy Settings */}
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 rounded-t-lg">
              <CardTitle className="flex items-center text-gray-900 dark:text-white">
                <Lock className="mr-2 h-5 w-5 text-green-500" />
                การตั้งค่าความเป็นส่วนตัว
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                กำหนดว่าใครสามารถเห็นข้อมูลส่วนตัวของคุณได้บ้าง
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              {/* ...existing privacy form... */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                <Label
                  htmlFor="profile_privacy"
                  className="text-gray-900 dark:text-white font-medium"
                >
                  ข้อมูลโปรไฟล์ (ชื่อ, รูป, ปีจบ, สาขา)
                </Label>
                <Select
                  value={privacy.profile_privacy}
                  onValueChange={(value) =>
                    handlePrivacyChange(
                      "profile_privacy",
                      value as any["profile_privacy"]
                    )
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="เลือก" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">สาธารณะ</SelectItem>
                    <SelectItem value="alumni_only">เฉพาะศิษย์เก่า</SelectItem>
                    <SelectItem value="admin_only">เฉพาะผู้ดูแลระบบ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                <Label
                  htmlFor="personal_privacy"
                  className="text-gray-900 dark:text-white font-medium"
                >
                  ข้อมูลส่วนตัว (ประวัติ, ที่ทำงาน)
                </Label>
                <Select
                  value={privacy.personal_privacy}
                  onValueChange={(value) =>
                    handlePrivacyChange(
                      "personal_privacy",
                      value as any["personal_privacy"]
                    )
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="เลือก" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">สาธารณะ</SelectItem>
                    <SelectItem value="alumni_only">เฉพาะศิษย์เก่า</SelectItem>
                    <SelectItem value="admin_only">เฉพาะผู้ดูแลระบบ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                <Label
                  htmlFor="work_privacy"
                  className="text-gray-900 dark:text-white font-medium"
                >
                  ข้อมูลการทำงาน
                </Label>
                <Select
                  value={privacy.work_privacy}
                  onValueChange={(value) =>
                    handlePrivacyChange(
                      "work_privacy",
                      value as any["work_privacy"]
                    )
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="เลือก" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">สาธารณะ</SelectItem>
                    <SelectItem value="alumni_only">เฉพาะศิษย์เก่า</SelectItem>
                    <SelectItem value="admin_only">เฉพาะผู้ดูแลระบบ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                <Label
                  htmlFor="contact_privacy"
                  className="text-gray-900 dark:text-white font-medium"
                >
                  ข้อมูลติดต่อ (เบอร์โทร, Line, Facebook, LinkedIn)
                </Label>
                <Select
                  value={privacy.contact_privacy}
                  onValueChange={(value) =>
                    handlePrivacyChange(
                      "contact_privacy",
                      value as any["contact_privacy"]
                    )
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="เลือก" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">สาธารณะ</SelectItem>
                    <SelectItem value="alumni_only">เฉพาะศิษย์เก่า</SelectItem>
                    <SelectItem value="admin_only">เฉพาะผู้ดูแลระบบ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </>
      )}
      {tab === "notification" && (
        <>
          {/* Notification Settings */}
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 rounded-t-lg">
              <CardTitle className="flex items-center text-gray-900 dark:text-white">
                <Bell className="mr-2 h-5 w-5 text-yellow-500" />
                การแจ้งเตือน
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                จัดการการแจ้งเตือนที่คุณต้องการรับ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              {/* ...existing notification form... */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                <Label
                  htmlFor="email_notifications"
                  className="text-gray-900 dark:text-white font-medium"
                >
                  รับการแจ้งเตือนทางอีเมล
                </Label>
                <Switch
                  id="email_notifications"
                  checked={notifications.email_notifications}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("email_notifications", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                <Label
                  htmlFor="discussion_replies"
                  className="text-gray-900 dark:text-white font-medium"
                >
                  แจ้งเตือนเมื่อมีคนตอบกระทู้
                </Label>
                <Switch
                  id="discussion_replies"
                  checked={notifications.discussion_replies}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("discussion_replies", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                <Label
                  htmlFor="news_updates"
                  className="text-gray-900 dark:text-white font-medium"
                >
                  แจ้งเตือนข่าวสารและกิจกรรมใหม่
                </Label>
                <Switch
                  id="news_updates"
                  checked={notifications.news_updates}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("news_updates", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Save Button and Status */}
      <div className="flex justify-end items-center gap-4 p-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700">
        {saveSuccess && (
          <div className="flex items-center px-4 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <CheckCircle className="mr-2 h-4 w-4 text-green-600 dark:text-green-400" />
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              บันทึกการเปลี่ยนแปลงแล้ว!
            </p>
          </div>
        )}
        {saveError && (
          <div className="flex items-center px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <XCircle className="mr-2 h-4 w-4 text-red-600 dark:text-red-400" />
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">
              เกิดข้อผิดพลาดในการบันทึก
            </p>
          </div>
        )}
        <Button
          onClick={handleSaveChanges}
          disabled={saving}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              กำลังบันทึก...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              บันทึกการเปลี่ยนแปลง
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
