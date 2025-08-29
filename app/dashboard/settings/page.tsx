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
import { useTheme } from "next-themes";

// Demo data
const demoUserProfile: any = {
  id: "alumni-user",
  email: "alumni@example.com",
  first_name: "สมชาย",
  last_name: "ใจดี",
  nickname: "ชาย",
  profile_image_url: "/diverse-group-profile.png",
  bio: "ศิษย์เก่ารุ่น 2018 วิศวกรรมคอมพิวเตอร์ ปัจจุบันเป็น Software Engineer ที่บริษัท เทคโนโลยี จำกัด",
  graduation_year: 2018,
  major: "วิศวกรรมคอมพิวเตอร์",
  phone: "081-234-5678",
  line_id: "somchai_line",
  facebook_url: "https://facebook.com/somchai",
  linkedin_url: "https://linkedin.com/in/somchai",
  current_company: "บริษัท เทคโนโลยี จำกัด",
  current_position: "Software Engineer",
  current_province: "กรุงเทพมหานคร",
};

const demoPrivacySettings: any = {
  profile_privacy: "alumni-only",
  personal_privacy: "alumni-only",
  work_privacy: "public",
  contact_privacy: "alumni-only",
};

const demoNotificationSettings: any = {
  email_notifications: true,
  discussion_replies: true,
  news_updates: true,
  birthday_reminders: false,
};

export default function SettingsPage() {
  // Tab state must be before any conditional return
  const [tab, setTab] = useState<string>("profile");
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<any>(demoUserProfile);
  const [privacy, setPrivacy] = useState<any>(demoPrivacySettings);
  const [notifications, setNotifications] = useState<any>(
    demoNotificationSettings
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<boolean>(false);

  const { theme, setTheme } = useTheme();
  const [darkMode, setDarkMode] = useState<string>("light");

  useEffect(() => {
    return setDarkMode(theme || "light");
  }, [theme]);

  const handleThemeChange = () => {
    setDarkMode((prev) => (prev === "dark" ? "light" : "dark"));
    setTheme(darkMode === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    const initializePage = async () => {
      // const currentUser = await getCurrentUser();
      // if (!currentUser) {
      //   // Redirect to login if no user
      //   // router.push("/auth/login");
      //   return;
      // }
      // setUser({ id: currentUser.id, email: currentUser.email });
      // // Simulate fetching user-specific data
      // await new Promise((resolve) => setTimeout(resolve, 500));
      // setProfile({
      //   ...demoUserProfile,
      //   id: currentUser.id,
      //   email: currentUser.email,
      // });
      // setPrivacy(demoPrivacySettings);
      // setNotifications(demoNotificationSettings);
      setLoading(false);
    };
    initializePage();
  }, []);

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setProfile((prev: any) => ({ ...prev, [id]: value }));
  };

  const handlePrivacyChange = (key: any, value: any) => {
    setPrivacy((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleNotificationChange = (key: any, checked: boolean) => {
    setNotifications((prev: any) => ({ ...prev, [key]: checked }));
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setSaveError(false);

    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

    // In a real app, you'd send profile, privacy, and notification data to your backend
    console.log("Saving profile:", profile);
    console.log("Saving privacy:", privacy);
    console.log("Saving notifications:", notifications);

    // Simulate success or failure
    const success = Math.random() > 0.1; // 90% chance of success
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000); // Hide success message after 3 seconds
    } else {
      setSaveError(true);
      setTimeout(() => setSaveError(false), 3000); // Hide error message after 3 seconds
    }

    setSaving(false);
  };

  if (loading) {
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
                  <Avatar className="h-24 w-24 ring-4 ring-blue-100 dark:ring-gray-700">
                    <AvatarImage
                      src={profile.profile_image_url || "/placeholder.svg"}
                      alt={`${profile.first_name} ${profile.last_name}`}
                    />
                    <AvatarFallback className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-600 dark:text-blue-400 text-3xl font-semibold">
                      {profile.first_name.charAt(0)}
                      {profile.last_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
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
                  </Button>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {profile.email}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    อีเมลของคุณ
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">ชื่อจริง</Label>
                  <Input
                    id="first_name"
                    value={profile.first_name}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">นามสกุล</Label>
                  <Input
                    id="last_name"
                    value={profile.last_name}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nickname">ชื่อเล่น</Label>
                  <Input
                    id="nickname"
                    value={profile.nickname}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="graduation_year">ปีที่จบการศึกษา</Label>
                  <Input
                    id="graduation_year"
                    type="number"
                    value={profile.graduation_year || ""}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="major">สาขาวิชา</Label>
                  <Input
                    id="major"
                    value={profile.major || ""}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">เกี่ยวกับฉัน</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio || ""}
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
                <div className="space-y-2">
                  <Label htmlFor="current_company">ชื่อบริษัท</Label>
                  <Input
                    id="current_company"
                    value={profile.current_company || ""}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current_position">ตำแหน่ง</Label>
                  <Input
                    id="current_position"
                    value={profile.current_position || ""}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="current_province">จังหวัดที่ทำงาน</Label>
                  <Input
                    id="current_province"
                    value={profile.current_province || ""}
                    onChange={handleProfileChange}
                  />
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
                    value={profile.phone || ""}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="line_id">Line ID</Label>
                  <Input
                    id="line_id"
                    value={profile.line_id || ""}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebook_url">Facebook URL</Label>
                  <Input
                    id="facebook_url"
                    value={profile.facebook_url || ""}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                  <Input
                    id="linkedin_url"
                    value={profile.linkedin_url || ""}
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
                    <SelectItem value="alumni-only">เฉพาะศิษย์เก่า</SelectItem>
                    <SelectItem value="admin-only">เฉพาะผู้ดูแลระบบ</SelectItem>
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
                    <SelectItem value="alumni-only">เฉพาะศิษย์เก่า</SelectItem>
                    <SelectItem value="admin-only">เฉพาะผู้ดูแลระบบ</SelectItem>
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
                    <SelectItem value="alumni-only">เฉพาะศิษย์เก่า</SelectItem>
                    <SelectItem value="admin-only">เฉพาะผู้ดูแลระบบ</SelectItem>
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
                    <SelectItem value="alumni-only">เฉพาะศิษย์เก่า</SelectItem>
                    <SelectItem value="admin-only">เฉพาะผู้ดูแลระบบ</SelectItem>
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
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                <Label
                  htmlFor="birthday_reminders"
                  className="text-gray-900 dark:text-white font-medium"
                >
                  แจ้งเตือนวันเกิดศิษย์เก่า
                </Label>
                <Switch
                  id="birthday_reminders"
                  checked={notifications.birthday_reminders}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("birthday_reminders", checked)
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
