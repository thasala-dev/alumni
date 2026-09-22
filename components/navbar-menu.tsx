"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
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
  Sun,
  Moon,
  Home,
  ChartSpline,
  Send,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-context";
import { timeAgo } from "@/lib/utils";

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

  const [conversations, setConversations] = useState<any[]>([]);
  const [totalUnread, setTotalUnread] = useState(0);
  const dmPollRef = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchConversations = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/messages?userId=${user.id}`);
      if (!res.ok) return;
      const data = await res.json();
      setConversations(data.conversations || []);
      setTotalUnread((data.conversations || []).reduce((sum: number, c: any) => sum + c.unread, 0));
    } catch {}
  };

  useEffect(() => {
    if (!user?.id) return;
    fetchConversations();
    dmPollRef.current = setInterval(fetchConversations, 10000);
    return () => { if (dmPollRef.current) clearInterval(dmPollRef.current); };
  }, [user?.id]);

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

  const isDark = mounted && theme === "dark";
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

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

          {/* DM Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="bg-gray-100 dark:bg-[#252728] relative p-3 rounded-2xl hover:text-[#81B214] hover:bg-[#81B214]/10 transition-all duration-300 group">
                <Send className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-[#81B214] dark:group-hover:text-[#81B214] transition-colors duration-300" />
                {totalUnread > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {totalUnread > 99 ? "99+" : totalUnread}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 p-0 rounded-2xl shadow-2xl bg-white/95 dark:bg-[#252728]/95 backdrop-blur-xl border border-gray-200/50 dark:border-neutral-700/50 overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-gray-100 dark:border-neutral-700 flex items-center justify-between">
                <span className="font-semibold text-gray-900 dark:text-gray-100">ข้อความ</span>
                {totalUnread > 0 && (
                  <span className="text-xs bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-medium">
                    {totalUnread} ใหม่
                  </span>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-neutral-700">
                {conversations.map((conv) => (
                  <DropdownMenuItem key={conv.user.id} asChild>
                    <Link
                      href={`/dashboard/messages/${conv.user.id}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-[#81B214]/5 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer"
                    >
                      <div className="relative shrink-0">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={conv.user.image} />
                          <AvatarFallback className="bg-[#81B214] text-white text-sm font-bold">
                            {conv.user.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {conv.unread > 0 && (
                          <span className="absolute -top-0.5 -right-0.5 bg-red-500 rounded-full w-2.5 h-2.5 border-2 border-white dark:border-[#252728]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-sm truncate ${conv.unread > 0 ? "font-semibold text-gray-900 dark:text-gray-100" : "font-medium text-gray-700 dark:text-gray-300"}`}>
                            {conv.user.name}
                          </span>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 shrink-0">
                            {timeAgo(conv.lastAt)}
                          </span>
                        </div>
                        <p className={`text-xs truncate mt-0.5 ${conv.unread > 0 ? "text-gray-700 dark:text-gray-300" : "text-gray-400 dark:text-gray-500"}`}>
                          {conv.lastMessage}
                        </p>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
                {conversations.length === 0 && (
                  <div className="px-6 py-8 text-center text-gray-400 dark:text-gray-500">
                    <Send className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">ยังไม่มีข้อความ</p>
                  </div>
                )}
              </div>
              <div className="border-t border-gray-100 dark:border-neutral-700 px-4 py-2.5 bg-gray-50/50 dark:bg-neutral-800/30">
                <Link
                  href="/dashboard/messages"
                  className="text-[#81B214] text-sm font-medium flex items-center justify-center gap-1 hover:underline"
                >
                  ดูข้อความทั้งหมด →
                </Link>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="bg-gray-100 dark:bg-[#252728] relative p-3 rounded-2xl hover:bg-[#81B214]/10 transition-all duration-300 group"
            title={isDark ? "เปลี่ยนเป็นโหมดสว่าง" : "เปลี่ยนเป็นโหมดมืด"}
          >
            {isDark ? (
              <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-[#81B214] dark:group-hover:text-[#81B214] transition-colors duration-300" />
            ) : (
              <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-[#81B214] dark:group-hover:text-[#81B214] transition-colors duration-300" />
            )}
          </button>

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
                  <div
                    onClick={toggleTheme}
                    className="flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer hover:bg-[#81B214]/10 dark:hover:bg-neutral-800/50 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 text-gray-800 dark:text-gray-100 font-medium">
                      {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                      <span>{isDark ? "โหมดมืด" : "โหมดสว่าง"}</span>
                    </div>
                    <Switch checked={isDark} onCheckedChange={toggleTheme} className="data-[state=checked]:bg-[#81B214]" />
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
