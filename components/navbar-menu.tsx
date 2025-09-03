"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import AlumniSearchBox from "@/components/AlumniSearchBox";
import {
  Users,
  Map,
  Newspaper,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  UserPlus,
  ChevronDown,
  Bell,
  Sun,
  Moon,
  Monitor,
  Home,
  ChartSpline,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function NavbarMenuItems() {
  const { user, isLoading, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Mobile Sheet open state
  const [open, setOpen] = useState(false);
  const handleNavClick = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const [notifications] = useState([
    { id: 1, message: "ประกาศรับสมัครงานเภสัชกรใหม่" },
    { id: 2, message: "การประชุมใหญ่สมาคมศิษย์เก่าประจำปี 2568" },
    { id: 3, message: "อัปเดตข้อมูลใบประกอบวิชาชีพเภสัชกรรม" },
  ]);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const navigation = [
    // { name: "หน้าหลัก", href: "/dashboard", icon: Home },
    { name: "ศิษย์เก่า", href: "/dashboard/alumni", icon: Users },
    { name: "แผนที่การกระจาย", href: "/dashboard/map", icon: Map },
    { name: "ข่าวสารศิษย์เก่า", href: "/dashboard/news", icon: Newspaper },

    ...(user?.role === "admin"
      ? [
          {
            name: "จัดการสมาชิก",
            href: "/dashboard/admin/users",
            icon: UserPlus,
          },
          {
            name: "รายงาน",
            href: "/dashboard/report",
            icon: ChartSpline,
          },
        ]
      : [
          {
            name: "กระทู้ศิษย์เก่า",
            href: "/dashboard/discussion",
            icon: MessageSquare,
          },
        ]),
  ];

  const handleSignOut = async () => {
    await logout();
    router.push("/auth/login");
  };

  const getThemeIcon = () => {
    if (!mounted)
      return (
        <Monitor className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-[#81B214] dark:group-hover:text-[#81B214] transition-colors duration-300" />
      );

    switch (theme) {
      case "light":
        return (
          <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-[#81B214] dark:group-hover:text-[#81B214] transition-colors duration-300" />
        );
      case "dark":
        return (
          <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-[#81B214] dark:group-hover:text-[#81B214] transition-colors duration-300" />
        );
      default:
        return (
          <Monitor className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-[#81B214] dark:group-hover:text-[#81B214] transition-colors duration-300" />
        );
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-neutral-700/50 shadow-lg supports-[backdrop-filter]:backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 h-18 flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <img src="/images/logo.png" alt="Logo" className="h-12" />
            {/* <span className="text-2xl font-black text-[#81B214]">
              WU Pharmacy
            </span> */}
          </Link>

          <div className="hidden lg:block w-72">
            <AlumniSearchBox />
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/dashboard"
            className={`relative flex items-center justify-center p-3 rounded-2xl transition-all duration-300 font-medium group bg-gray-100 dark:bg-[#252728] text-gray-600 dark:text-gray-300 hover:text-[#81B214] hover:bg-[#81B214]/10`}
            title="หน้าหลัก"
          >
            <Home
              className={`relative h-5 w-5 transition-transform duration-300 group-hover:scale-110 dark:group-hover:text-[#81B214]`}
            />
          </Link>
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center justify-center p-3 rounded-2xl transition-all duration-300 font-medium group
                  ${
                    isActive
                      ? "text-white bg-gradient-to-r from-[#81B214] to-[#50B003]"
                      : "bg-gray-100 dark:bg-[#252728] text-gray-600 dark:text-gray-300 hover:text-[#81B214] hover:bg-[#81B214]/10"
                  }`}
                title={item.name}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#81B214] to-[#50B003] rounded-2xl"></div>
                )}
                <item.icon
                  className={`relative h-5 w-5 transition-transform duration-300 group-hover:scale-110 dark:group-hover:text-[#81B214]  ${
                    isActive ? "drop-shadow-sm" : ""
                  }`}
                />
              </Link>
            );
          })}

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="bg-gray-100 dark:bg-[#252728] relative p-3 rounded-2xl hover:text-[#81B214] hover:bg-[#81B214]/10 transition-all duration-300 group">
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-[#81B214] dark:group-hover:text-[#81B214] transition-colors duration-300" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                    {notifications.length}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 p-0 rounded-2xl shadow-2xl bg-white/95 dark:bg-[#252728]/95 backdrop-blur-xl border border-gray-200/50 dark:border-neutral-700/50"
            >
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-neutral-700">
                {notifications.map((n) => (
                  <DropdownMenuItem
                    key={n.id}
                    className="px-6 py-4 text-sm hover:bg-[#81B214]/10/50 dark:hover:bg-neutral-800/50 transition-colors duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-2 w-2 mt-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-sm" />
                      <div className="flex-1">
                        <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
                          {n.message}
                        </p>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                          <div className="h-1 w-1 bg-gray-400 rounded-full"></div>
                          เมื่อสักครู่
                        </div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <div className="border-t border-gray-100 dark:border-neutral-700 px-6 py-3 text-center bg-gray-50/50 dark:bg-neutral-800/30">
                <Link
                  href="/dashboard/news"
                  className="text-[#81B214] dark:text-[#81B214] hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-200"
                >
                  ดูการแจ้งเตือนทั้งหมด →
                </Link>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="bg-gray-100 dark:bg-[#252728] relative p-3 rounded-2xl hover:text-[#81B214] hover:bg-[#81B214]/10 transition-all duration-300 group">
                {getThemeIcon()}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 rounded-2xl shadow-2xl bg-white/95 dark:bg-[#252728]/95 backdrop-blur-xl border border-gray-200/50 dark:border-neutral-700/50 p-2"
            >
              <DropdownMenuItem
                onClick={() => setTheme("light")}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#81B214]/10 dark:hover:bg-neutral-800/50 transition-all duration-200"
              >
                <Sun className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                <span className="text-gray-900 dark:text-gray-100">สว่าง</span>
                {theme === "light" && mounted && (
                  <div className="ml-auto w-2 h-2 bg-[#81B214] rounded-full"></div>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("dark")}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#81B214]/10 dark:hover:bg-neutral-800/50 transition-all duration-200"
              >
                <Moon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                <span className="text-gray-900 dark:text-gray-100">มืด</span>
                {theme === "dark" && mounted && (
                  <div className="ml-auto w-2 h-2 bg-[#81B214] rounded-full"></div>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("system")}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#81B214]/10 dark:hover:bg-neutral-800/50 transition-all duration-200"
              >
                <Monitor className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                <span className="text-gray-900 dark:text-gray-100">
                  ตามระบบ
                </span>
                {theme === "system" && mounted && (
                  <div className="ml-auto w-2 h-2 bg-[#81B214] rounded-full"></div>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User avatar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 py-2 rounded-2xl hover:bg-[#81B214]/10/80 dark:hover:bg-neutral-800/50 transition-all duration-300 group">
                <div className="relative">
                  <div className="absolute -inset-0.5 rounded-full transition duration-300"></div>

                  <Avatar className="h-11 w-11">
                    <AvatarImage src={user?.image} />
                    <AvatarFallback className="bg-[#81B214]/10 dark:bg-[#81B214] text-[#81B214] dark:text-white text-2xl font-semibold">
                      {user?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <span className="hidden lg:inline text-sm font-semibold text-gray-800 dark:text-gray-100 group-hover:text-[#81B214] dark:group-hover:text-[#81B214] transition-colors duration-300">
                  {user?.name || "บัญชีของฉัน"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-[#81B214] dark:group-hover:text-[#81B214] transition-all duration-300 group-hover:rotate-180" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-52 rounded-2xl shadow-2xl bg-white/95 dark:bg-[#252728]/95 backdrop-blur-xl border border-gray-200/50 dark:border-neutral-700/50 p-2"
            >
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#81B214]/10 dark:hover:bg-neutral-800/50 transition-all duration-200"
                >
                  <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-neutral-800">
                    <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <span className="font-medium">ตั้งค่า</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-2 bg-gray-200 dark:bg-neutral-700" />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
              >
                <div className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/30">
                  <LogOut className="w-4 h-4" />
                </div>
                <span className="font-medium">ออกจากระบบ</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <div className="h-14 w-14 rounded-2xl hover:bg-[#81B214]/10 dark:hover:bg-neutral-800/50 transition-all duration-300 flex items-center justify-center">
                <Menu className="h-10 w-10 text-[#81B214]" />
              </div>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-72 max-h-screen overflow-y-auto bg-white/95 dark:bg-[#252728]/95 backdrop-blur-xl border-r border-gray-200/50 dark:border-neutral-700/50"
              style={{ scrollBehavior: "smooth" }}
            >
              <SheetTitle className="sr-only">เมนูนำทาง</SheetTitle>
              <div className="p-4 flex items-center justify-center gap-3">
                <img src="/images/logo.png" alt="Logo" className="h-16" />
              </div>
              <nav className="flex flex-col gap-2 p-4">
                <button
                  onClick={() => handleNavClick("/dashboard")}
                  className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-medium transition-all duration-300 text-gray-800 dark:text-gray-100 hover:bg-[#81B214]/10 dark:hover:bg-neutral-800/50`}
                >
                  <Home className="h-5 w-5" />
                  <span>หน้าหลัก</span>
                </button>
                {navigation.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <button
                      key={item.href}
                      onClick={() => handleNavClick(item.href)}
                      className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-medium transition-all duration-300 cursor-pointer
                    ${
                      isActive
                        ? "bg-gradient-to-r from-[#81B214] to-[#50B003] text-white shadow-lg shadow-blue-500/25"
                        : "text-gray-800 dark:text-gray-100 hover:bg-[#81B214]/10 dark:hover:bg-neutral-800/50"
                    }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </button>
                  );
                })}

                <button
                  onClick={() => handleNavClick("/dashboard/settings")}
                  className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-medium transition-all duration-300 cursor-pointer
                    ${
                      pathname.startsWith("/dashboard/settings")
                        ? "bg-gradient-to-r from-[#81B214] to-[#50B003] text-white shadow-lg shadow-blue-500/25"
                        : "text-gray-800 dark:text-gray-100 hover:bg-[#81B214]/10 dark:hover:bg-neutral-800/50"
                    }`}
                >
                  <Settings className="h-5 w-5" />
                  <span>ตั้งค่า</span>
                </button>
                {/* Theme Toggle in Mobile */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-neutral-700">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 px-4">
                    ธีมการแสดงผล
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setTheme("light")}
                      className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-medium transition-all duration-300 ${
                        theme === "light" && mounted
                          ? "bg-blue-50 dark:bg-blue-900/20 text-[#81B214] dark:text-[#81B214]"
                          : "text-gray-800 dark:text-gray-100 hover:bg-[#81B214]/10 dark:hover:bg-neutral-800/50"
                      }`}
                    >
                      <Sun className="h-5 w-5" />
                      <span>สว่าง</span>
                      {theme === "light" && mounted && (
                        <div className="ml-auto w-2 h-2 bg-[#81B214] rounded-full"></div>
                      )}
                    </button>
                    <button
                      onClick={() => setTheme("dark")}
                      className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-medium transition-all duration-300 ${
                        theme === "dark" && mounted
                          ? "bg-blue-50 dark:bg-blue-900/20 text-[#81B214] dark:text-[#81B214]"
                          : "text-gray-800 dark:text-gray-100 hover:bg-[#81B214]/10 dark:hover:bg-neutral-800/50"
                      }`}
                    >
                      <Moon className="h-5 w-5" />
                      <span>มืด</span>
                      {theme === "dark" && mounted && (
                        <div className="ml-auto w-2 h-2 bg-[#81B214] rounded-full"></div>
                      )}
                    </button>
                    <button
                      onClick={() => setTheme("system")}
                      className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-medium transition-all duration-300 ${
                        theme === "system" && mounted
                          ? "bg-blue-50 dark:bg-blue-900/20 text-[#81B214] dark:text-[#81B214]"
                          : "text-gray-800 dark:text-gray-100 hover:bg-[#81B214]/10 dark:hover:bg-neutral-800/50"
                      }`}
                    >
                      <Monitor className="h-5 w-5" />
                      <span>ตามระบบ</span>
                      {theme === "system" && mounted && (
                        <div className="ml-auto w-2 h-2 bg-[#81B214] rounded-full"></div>
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="mt-6 text-red-600 dark:text-red-400 flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
                >
                  <LogOut className="h-5 w-5" />
                  <span>ออกจากระบบ</span>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
