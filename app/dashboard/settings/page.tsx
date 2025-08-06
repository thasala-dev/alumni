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
  Moon,
  Sun,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { useTheme } from "next-themes";

// Define types for profile and settings
interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  nickname: string;
  profile_image_url?: string;
  bio?: string;
  graduation_year?: number;
  major?: string;
  phone?: string;
  line_id?: string;
  facebook_url?: string;
  linkedin_url?: string;
  current_company?: string;
  current_position?: string;
  current_province?: string;
}

interface PrivacySettings {
  profile_privacy: "public" | "alumni-only" | "admin-only";
  personal_privacy: "public" | "alumni-only" | "admin-only";
  work_privacy: "public" | "alumni-only" | "admin-only";
  contact_privacy: "public" | "alumni-only" | "admin-only";
}

interface NotificationSettings {
  email_notifications: boolean;
  discussion_replies: boolean;
  news_updates: boolean;
  birthday_reminders: boolean;
}

// Demo data
const demoUserProfile: UserProfile = {
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

const demoPrivacySettings: PrivacySettings = {
  profile_privacy: "alumni-only",
  personal_privacy: "alumni-only",
  work_privacy: "public",
  contact_privacy: "alumni-only",
};

const demoNotificationSettings: NotificationSettings = {
  email_notifications: true,
  discussion_replies: true,
  news_updates: true,
  birthday_reminders: false,
};

export default function SettingsPage() {
  // Tab state must be before any conditional return
  const [tab, setTab] = useState<string>("profile");
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile>(demoUserProfile);
  const [privacy, setPrivacy] = useState<PrivacySettings>(demoPrivacySettings);
  const [notifications, setNotifications] = useState<NotificationSettings>(
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
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        // Redirect to login if no user
        // router.push("/auth/login");
        return;
      }
      setUser({ id: currentUser.id, email: currentUser.email });
      // Simulate fetching user-specific data
      await new Promise((resolve) => setTimeout(resolve, 500));
      setProfile({
        ...demoUserProfile,
        id: currentUser.id,
        email: currentUser.email,
      });
      setPrivacy(demoPrivacySettings);
      setNotifications(demoNotificationSettings);
      setLoading(false);
    };
    initializePage();
  }, []);

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setProfile((prev) => ({ ...prev, [id]: value }));
  };

  const handlePrivacyChange = (
    key: keyof PrivacySettings,
    value: PrivacySettings[keyof PrivacySettings]
  ) => {
    setPrivacy((prev) => ({ ...prev, [key]: value }));
  };

  const handleNotificationChange = (
    key: keyof NotificationSettings,
    checked: boolean
  ) => {
    setNotifications((prev) => ({ ...prev, [key]: checked }));
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
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">ตั้งค่า</h1>
        <p className="text-gray-600">
          จัดการข้อมูลโปรไฟล์, ความเป็นส่วนตัว และการแจ้งเตือนของคุณ
        </p>
      </div>
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-neutral-800 mb-4">
        <button
          className={`px-4 py-2 font-medium rounded-t transition focus:outline-none ${
            tab === "profile"
              ? "bg-white dark:bg-neutral-950 border-x border-t border-b-0 border-gray-200 dark:border-neutral-800 text-blue-700 dark:text-blue-400"
              : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          }`}
          onClick={() => setTab("profile")}
        >
          ข้อมูลโปรไฟล์
        </button>
        <button
          className={`px-4 py-2 font-medium rounded-t transition focus:outline-none ${
            tab === "privacy"
              ? "bg-white dark:bg-neutral-950 border-x border-t border-b-0 border-gray-200 dark:border-neutral-800 text-blue-700 dark:text-blue-400"
              : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          }`}
          onClick={() => setTab("privacy")}
        >
          ความเป็นส่วนตัว
        </button>
        <button
          className={`px-4 py-2 font-medium rounded-t transition focus:outline-none ${
            tab === "notification"
              ? "bg-white dark:bg-neutral-950 border-x border-t border-b-0 border-gray-200 dark:border-neutral-800 text-blue-700 dark:text-blue-400"
              : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          }`}
          onClick={() => setTab("notification")}
        >
          การแจ้งเตือน
        </button>
        <button
          className={`px-4 py-2 font-medium rounded-t transition focus:outline-none ${
            tab === "appearance"
              ? "bg-white dark:bg-neutral-950 border-x border-t border-b-0 border-gray-200 dark:border-neutral-800 text-blue-700 dark:text-blue-400"
              : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          }`}
          onClick={() => setTab("appearance")}
        >
          โหมดแสดงผล
        </button>
      </div>

      {/* Tab Content */}
      {tab === "profile" && (
        <>
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                ข้อมูลโปรไฟล์
              </CardTitle>
              <CardDescription>
                อัปเดตข้อมูลส่วนตัวและข้อมูลการศึกษาของคุณ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* ...existing profile form... */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={profile.profile_image_url || "/placeholder.svg"}
                      alt={`${profile.first_name} ${profile.last_name}`}
                    />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-3xl font-semibold">
                      {profile.first_name.charAt(0)}
                      {profile.last_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full bg-white shadow-md"
                    onClick={() => alert("อัปโหลดรูปภาพโปรไฟล์")}
                  >
                    <Camera className="h-4 w-4" />
                    <span className="sr-only">อัปโหลดรูปภาพ</span>
                  </Button>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {profile.email}
                  </p>
                  <p className="text-sm text-gray-500">อีเมลของคุณ</p>
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

              <h3 className="text-lg font-semibold text-gray-900">
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

              <h3 className="text-lg font-semibold text-gray-900">
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="mr-2 h-5 w-5" />
                การตั้งค่าความเป็นส่วนตัว
              </CardTitle>
              <CardDescription>
                กำหนดว่าใครสามารถเห็นข้อมูลส่วนตัวของคุณได้บ้าง
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* ...existing privacy form... */}
              <div className="flex items-center justify-between">
                <Label htmlFor="profile_privacy">
                  ข้อมูลโปรไฟล์ (ชื่อ, รูป, ปีจบ, สาขา)
                </Label>
                <Select
                  value={privacy.profile_privacy}
                  onValueChange={(value) =>
                    handlePrivacyChange(
                      "profile_privacy",
                      value as PrivacySettings["profile_privacy"]
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
              <div className="flex items-center justify-between">
                <Label htmlFor="personal_privacy">
                  ข้อมูลส่วนตัว (ประวัติ, ที่ทำงาน)
                </Label>
                <Select
                  value={privacy.personal_privacy}
                  onValueChange={(value) =>
                    handlePrivacyChange(
                      "personal_privacy",
                      value as PrivacySettings["personal_privacy"]
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
              <div className="flex items-center justify-between">
                <Label htmlFor="work_privacy">ข้อมูลการทำงาน</Label>
                <Select
                  value={privacy.work_privacy}
                  onValueChange={(value) =>
                    handlePrivacyChange(
                      "work_privacy",
                      value as PrivacySettings["work_privacy"]
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
              <div className="flex items-center justify-between">
                <Label htmlFor="contact_privacy">
                  ข้อมูลติดต่อ (เบอร์โทร, Line, Facebook, LinkedIn)
                </Label>
                <Select
                  value={privacy.contact_privacy}
                  onValueChange={(value) =>
                    handlePrivacyChange(
                      "contact_privacy",
                      value as PrivacySettings["contact_privacy"]
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                การแจ้งเตือน
              </CardTitle>
              <CardDescription>
                จัดการการแจ้งเตือนที่คุณต้องการรับ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* ...existing notification form... */}
              <div className="flex items-center justify-between">
                <Label htmlFor="email_notifications">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="discussion_replies">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="news_updates">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="birthday_reminders">
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
      {tab === "appearance" && (
        <>
          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Moon className="mr-2 h-5 w-5" />
                โหมดแสดงผล
              </CardTitle>
              <CardDescription>
                เลือกโหมดแสงสว่างหรือโหมดมืดสำหรับการใช้งาน
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun
                    className={`h-5 w-5 ${
                      !darkMode ? "text-yellow-500" : "text-gray-400"
                    }`}
                  />
                  <span className="font-medium">โหมดสว่าง</span>
                </div>
                <Switch
                  id="dark_mode"
                  checked={darkMode === "dark"}
                  onCheckedChange={handleThemeChange}
                />
                <div className="flex items-center gap-2">
                  <Moon
                    className={`h-5 w-5 ${
                      darkMode ? "text-blue-700" : "text-gray-400"
                    }`}
                  />
                  <span className="font-medium">โหมดมืด</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                * ตัวอย่าง UI เท่านั้น ยังไม่เชื่อมต่อกับระบบธีมจริง
              </p>
            </CardContent>
          </Card>
        </>
      )}

      {/* Save Button and Status */}
      <div className="flex justify-end items-center gap-4">
        {saveSuccess && (
          <p className="text-sm text-green-600 flex items-center">
            <CheckCircle className="mr-2 h-4 w-4" /> บันทึกการเปลี่ยนแปลงแล้ว!
          </p>
        )}
        {saveError && (
          <p className="text-sm text-red-600 flex items-center">
            <XCircle className="mr-2 h-4 w-4" /> เกิดข้อผิดพลาดในการบันทึก
          </p>
        )}
        <Button onClick={handleSaveChanges} disabled={saving}>
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
