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
  Folder,
  Bot,
  Quote,
  Map,
} from "lucide-react";

export default function AsideMenuItems() {
  return (
    <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-20 self-start h-fit">
      <nav className="space-y-2">
        <a
          href="/dashboard"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-[#81B214]/10 dark:hover:bg-neutral-800 font-medium transition"
        >
          <Home className="h-5 w-5 text-blue-600" />
          หน้าหลัก
        </a>
        <a
          href="/dashboard/alumni"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-[#81B214]/10 dark:hover:bg-neutral-800 font-medium transition"
        >
          <Users className="h-5 w-5 text-green-600" />
          ศิษย์เก่า
        </a>
        <a
          href="/dashboard/map"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-[#81B214]/10 dark:hover:bg-neutral-800 font-medium transition"
        >
          <Map className="h-5 w-5 text-indigo-600" />
          แผนที่การกระจาย
        </a>
        <a
          href="/dashboard/news"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-[#81B214]/10 dark:hover:bg-neutral-800 font-medium transition"
        >
          <Newspaper className="h-5 w-5 text-purple-600" />
          ข่าวสารศิษย์เก่า
        </a>

        <div className="border-t border-gray-200 dark:border-neutral-800 my-4" />
        <a
          href="/dashboard/discussion"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-[#81B214]/10 dark:hover:bg-neutral-800 font-medium transition"
        >
          <MessageSquare className="h-5 w-5 text-orange-500" />
          กระทู้ศิษย์เก่า
        </a>
        <div className="ml-4">
          <a
            href="/dashboard/discussion/1"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-[#81B214]/10 dark:hover:bg-neutral-800 font-medium transition"
          >
            <Folder className="h-5 w-5 text-blue-600" />
            ทั่วไป
          </a>
          <a
            href="/dashboard/discussion/2"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-[#81B214]/10 dark:hover:bg-neutral-800 font-medium transition"
          >
            <Briefcase className="h-5 w-5 text-emerald-600" />
            หางาน
          </a>
          <a
            href="/dashboard/discussion/3"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-[#81B214]/10 dark:hover:bg-neutral-800 font-medium transition"
          >
            <Bot className="h-5 w-5 text-yellow-600" />
            เทคโนโลยี
          </a>
          <a
            href="/dashboard/discussion/4"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-[#81B214]/10 dark:hover:bg-neutral-800 font-medium transition"
          >
            <Calendar className="h-5 w-5 text-pink-600" />
            กิจกรรม
          </a>
          <a
            href="/dashboard/discussion/5"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-[#81B214]/10 dark:hover:bg-neutral-800 font-medium transition"
          >
            <Quote className="h-5 w-5 text-rose-600" />
            คำถาม-คำตอบ
          </a>
        </div>

        <div className="border-t border-gray-200 dark:border-neutral-800 my-4" />

        <a
          href="/dashboard/settings"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-[#81B214]/10 dark:hover:bg-neutral-800 font-medium transition"
        >
          <Settings className="h-5 w-5 text-gray-600" />
          การตั้งค่า
        </a>
      </nav>
    </aside>
  );
}
