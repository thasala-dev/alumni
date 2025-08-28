import {
  Home,
  Users,
  MapPin,
  Newspaper,
  MessageSquare,
  Settings,
  Briefcase,
  GraduationCap,
  Calendar,
  Award,
} from "lucide-react";

export default function AsideMenuItems() {
  return (
    <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-20 self-start h-fit">
      <nav className="space-y-2">
        <a
          href="/dashboard"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-neutral-800 font-medium transition"
        >
          <Home className="h-5 w-5 text-blue-600" />
          หน้าหลัก
        </a>
        <a
          href="/dashboard/alumni"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-neutral-800 font-medium transition"
        >
          <Users className="h-5 w-5 text-green-600" />
          ศิษย์เก่า
        </a>
        <a
          href="/dashboard/map"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-neutral-800 font-medium transition"
        >
          <MapPin className="h-5 w-5 text-indigo-600" />
          แผนที่การกระจาย
        </a>
        <a
          href="/dashboard/news"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-neutral-800 font-medium transition"
        >
          <Newspaper className="h-5 w-5 text-purple-600" />
          ข่าวสารและงาน
        </a>
        <a
          href="/dashboard/discussion"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-neutral-800 font-medium transition"
        >
          <MessageSquare className="h-5 w-5 text-orange-500" />
          เว็บบอร์ดวิชาชีพ
        </a>

        <div className="border-t border-gray-200 dark:border-neutral-800 my-4" />

        <a
          href="/dashboard/jobs"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-neutral-800 font-medium transition"
        >
          <Briefcase className="h-5 w-5 text-emerald-600" />
          ตำแหน่งงาน
        </a>
        <a
          href="/dashboard/courses"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-neutral-800 font-medium transition"
        >
          <GraduationCap className="h-5 w-5 text-cyan-600" />
          หลักสูตรอบรม
        </a>
        <a
          href="/dashboard/events"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-neutral-800 font-medium transition"
        >
          <Calendar className="h-5 w-5 text-pink-600" />
          กิจกรรมและงาน
        </a>
        <a
          href="/dashboard/achievements"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-neutral-800 font-medium transition"
        >
          <Award className="h-5 w-5 text-yellow-600" />
          รางวัลและเกียรติ
        </a>

        <div className="border-t border-gray-200 dark:border-neutral-800 my-4" />

        <a
          href="/dashboard/settings"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-neutral-800 font-medium transition"
        >
          <Settings className="h-5 w-5 text-gray-400" />
          การตั้งค่า
        </a>
      </nav>
    </aside>
  );
}
